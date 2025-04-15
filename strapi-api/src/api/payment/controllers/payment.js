'use strict'

/**
 * payment controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::payment.payment', ({ strapi }) => ({
	/**
	 * Создание платежа
	 * @param {Object} ctx - Контекст Koa
	 * @example
	 * // Тело запроса для создания платежа:
	 * {
	 *   "data": {
	 *     "amount": 1500,
	 *     "order": 1,
	 *     "payment_method": "yookassa_redirect"
	 *   }
	 * }
	 */
	async create(ctx) {
		const { data } = ctx.request.body
		console.log(`DATTAAAA: ${JSON.stringify(data)}`)
		console.log(data.amount)
		// const order = 44
		const { amount, order, payment_method } = data
		// const { amount, payment_method } = data
		const user = ctx.state.user
		console.log(amount, order, payment_method)

		if (!user) {
			return ctx.unauthorized('User not authenticated')
		}

		try {
			console.log('перед order_items')

			// Проверяем заказ
			const orderEntity = await strapi.entityService.findOne(
				'api::order.order',
				order,
				{
					populate: ['user', 'order_items'],
				}
			)

			console.log('после order_items')

			if (!orderEntity) {
				return ctx.notFound('Order not found')
			}

			if (!orderEntity.user) {
				return ctx.badRequest('Order has no associated user')
			}

			// Проверяем, что заказ принадлежит пользователю
			if (orderEntity.user.id !== user.id) {
				return ctx.forbidden(`Access denied to this order ${order}`)
			}

			// Проверяем, что заказ еще не оплачен
			if (orderEntity.order_status === 'paid') {
				return ctx.badRequest('Order is already paid')
			}

			// Создаем платеж в ЮKassa
			const yookassaPayment = await strapi
				.service('api::payment.payment')
				.createYookassaPayment({
					amount: {
						value: amount.toFixed(2),
						currency: 'RUB',
					},
					payment_method,
					order_id: order,
					user_id: user.id,
					return_url: `${process.env.FRONTEND_URL}/orders/${order}/success`,
				})

			// Создаем запись в нашей БД
			const payment = await strapi.entityService.create(
				'api::payment.payment',
				{
					data: {
						amount,
						currency: 'RUB',
						payment_status: 'pending',
						payment_method,
						yookassa_id: yookassaPayment.id,
						confirmation_url: yookassaPayment.confirmation.confirmation_url,
						description: `Оплата заказа #${order}`,
						metadata: {
							order_id: order,
							user_id: user.id,
						},
						order,
						users_permissions_user: user.id,
						publishedAt: new Date(),
					},
				}
			)

			return this.transformResponse({
				...payment,
				confirmation_url: yookassaPayment.confirmation.confirmation_url,
			})
		} catch (error) {
			console.error('Payment creation error:', error)
			ctx.throw(500, error)
		}
	},

	/**
	 * Получение информации о платеже
	 * @param {Object} ctx - Контекст Koa
	 */
	async findOne(ctx) {
		const { id } = ctx.params
		const user = ctx.state.user

		try {
			const payment = await strapi.entityService.findOne(
				'api::payment.payment',
				id,
				{
					populate: ['order', 'users_permissions_user'],
				}
			)

			if (!payment) {
				return ctx.notFound('Payment not found')
			}

			// Проверяем, что платеж принадлежит пользователю
			if (payment.users_permissions_user.id !== user.id) {
				return ctx.forbidden('Access denied to this payment')
			}

			return payment
		} catch (error) {
			ctx.throw(500, error)
		}
	},

	/**
	 * Обработка вебхука от ЮKassa
	 * @param {Object} ctx - Контекст Koa
	 */
	async webhook(ctx) {
		const { body, headers } = ctx.request

		try {
			// Проверяем подпись вебхука
			const isValid = await strapi
				.service('api::payment.payment')
				.verifyWebhookSignature(body, headers['x-payment-sha256'])

			if (!isValid) {
				return ctx.forbidden('Invalid webhook signature')
			}

			const { object: yookassaPayment } = body

			// Находим платеж по yookassa_id
			const payment = await strapi.db.query('api::payment.payment').findOne({
				where: { yookassa_id: yookassaPayment.id },
				populate: ['order'],
			})

			if (!payment) {
				return ctx.notFound('Payment not found')
			}

			// Обновляем статус платежа
			await strapi.entityService.update('api::payment.payment', payment.id, {
				data: {
					payment_status: yookassaPayment.status,
					metadata: {
						...payment.metadata,
						yookassa_response: yookassaPayment,
					},
				},
			})

			// Если платеж успешен, обновляем статус заказа
			if (yookassaPayment.status === 'succeeded') {
				await strapi.entityService.update(
					'api::order.order',
					payment.order.id,
					{
						data: {
							order_status: 'paid',
						},
					}
				)
			}

			return { success: true }
		} catch (error) {
			ctx.throw(500, error)
		}
	},
}))
