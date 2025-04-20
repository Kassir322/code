'use strict'

/**
 * payment controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::payment.payment', ({ strapi }) => ({
	/**
	 * Создание платежа
	 */
	async create(ctx) {
		try {
			console.log('create payment data: ', ctx.request.body)

			const { order, amount, payment_method } = ctx.request.body.data
			const user = ctx.state.user

			if (!user) {
				return ctx.unauthorized('Необходима авторизация')
			}

			// Генерируем ключ идемпотентности
			const idempotencyKey = crypto.randomUUID()

			const paymentData = {
				order,
				amount: {
					value: amount,
					currency: 'RUB',
				},
				payment_method,
				return_url: `${process.env.FRONTEND_URL}/orders/${order}`,
				user_id: user.id,
			}

			const result = await strapi
				.service('api::payment.payment')
				.createYookassaPayment(paymentData, idempotencyKey)

			if (result.error) {
				console.log(`ошибочка вот тут 1`)

				return ctx.badRequest(result.error)
			}

			// Создаем запись в БД
			const payment = await strapi.entityService.create(
				'api::payment.payment',
				{
					data: {
						yookassa_id: result.id,
						order: order,
						amount,
						status: result.status,
						users_permissions_user: user.id,
						publishedAt: new Date(),
						payment_method: payment_method,
					},
				}
			)

			// Возвращаем платеж с URL для перенаправления
			return this.transformResponse({
				...payment,
				confirmation_url: result.confirmation.confirmation_url,
			})
		} catch (error) {
			console.error('Ошибка создания платежа:', error)
			return ctx.badRequest('Ошибка создания платежа')
		}
	},

	/**
	 * Получение информации о платеже
	 */
	async findOne(ctx) {
		try {
			const { id } = ctx.params
			const user = ctx.state.user

			if (!user) {
				return ctx.unauthorized('Необходима авторизация')
			}

			// Получаем платеж из БД
			const payment = await strapi.entityService.findOne(
				'api::payment.payment',
				id,
				{
					populate: ['user'],
				}
			)

			if (!payment) {
				return ctx.notFound('Платеж не найден')
			}

			// Проверяем принадлежность платежа пользователю
			if (payment.user.id !== user.id) {
				return ctx.forbidden('Нет доступа к этому платежу')
			}

			// Получаем актуальную информацию из ЮKassa
			const yookassaInfo = await strapi
				.service('api::payment.payment')
				.getYookassaPayment(payment.yookassa_id)

			if (yookassaInfo.error) {
				return ctx.badRequest(yookassaInfo.error)
			}

			// Обновляем статус в БД если он изменился
			if (payment.status !== yookassaInfo.status) {
				await strapi.entityService.update('api::payment.payment', id, {
					data: {
						status: yookassaInfo.status,
					},
				})
			}

			return this.transformResponse({
				...payment,
				yookassa_info: yookassaInfo,
			})
		} catch (error) {
			console.error('Ошибка получения информации о платеже:', error)
			return ctx.badRequest('Ошибка получения информации о платеже')
		}
	},

	/**
	 * Получение URL чека
	 */
	async getReceiptUrl(ctx) {
		try {
			const { id } = ctx.params
			const user = ctx.state.user

			if (!user) {
				return ctx.unauthorized('Необходима авторизация')
			}

			const payment = await strapi.entityService.findOne(
				'api::payment.payment',
				id,
				{
					populate: ['user'],
				}
			)

			if (!payment) {
				return ctx.notFound('Платеж не найден')
			}

			if (payment.user.id !== user.id) {
				return ctx.forbidden('Нет доступа к этому платежу')
			}

			const receiptUrl = await strapi
				.service('api::payment.payment')
				.getReceiptUrl(payment.yookassa_id)

			if (receiptUrl.error) {
				return ctx.badRequest(receiptUrl.error)
			}

			return this.transformResponse({ receipt_url: receiptUrl })
		} catch (error) {
			console.error('Ошибка получения URL чека:', error)
			return ctx.badRequest('Ошибка получения URL чека')
		}
	},

	/**
	 * Создание возврата
	 */
	async createRefund(ctx) {
		try {
			const { id } = ctx.params
			const { amount, reason } = ctx.request.body
			const user = ctx.state.user

			if (!user) {
				return ctx.unauthorized('Необходима авторизация')
			}

			const payment = await strapi.entityService.findOne(
				'api::payment.payment',
				id,
				{
					populate: ['user'],
				}
			)

			if (!payment) {
				return ctx.notFound('Платеж не найден')
			}

			if (payment.user.id !== user.id) {
				return ctx.forbidden('Нет доступа к этому платежу')
			}

			// Генерируем ключ идемпотентности
			const idempotencyKey = crypto.randomUUID()

			const refund = await strapi
				.service('api::payment.payment')
				.createRefund(payment.yookassa_id, amount, reason, idempotencyKey)

			if (refund.error) {
				return ctx.badRequest(refund.error)
			}

			// Создаем запись о возврате в БД
			const refundRecord = await strapi.entityService.create(
				'api::payment.payment',
				{
					data: {
						yookassa_id: refund.id,
						order: payment.order,
						amount: -amount, // Отрицательная сумма для возврата
						status: refund.status,
						user: user.id,
						refund_reason: reason,
						refund_status: refund.status,
						publishedAt: new Date(),
					},
				}
			)

			return this.transformResponse(refundRecord)
		} catch (error) {
			console.error('Ошибка создания возврата:', error)
			return ctx.badRequest('Ошибка создания возврата')
		}
	},

	/**
	 * Обработка вебхуков от ЮKassa
	 */
	async webhook(ctx) {
		try {
			const signature = ctx.request.headers['x-webhook-signature']
			const body = ctx.request.body

			// // Проверяем подпись
			// const isValid = await strapi
			// 	.service('api::payment.payment')
			// 	.verifyWebhookSignature(body, signature)

			// if (!isValid) {
			// 	return ctx.unauthorized('Неверная подпись')
			// }

			const { event, object } = body
			console.log(`webhook event: ${event}`)
			console.log(`webhook object: ${JSON.stringify(object)}`)

			switch (event) {
				case 'payment.succeeded':
					// Находим платеж по yookassa_id
					const payment = await strapi.entityService.findMany(
						'api::payment.payment',
						{
							filters: { yookassa_id: object.id },
						}
					)

					console.log(`payment: ${JSON.stringify(payment)}`)

					if (payment.length > 0) {
						console.log(`зашел в payment.succeeded length > 0`)
						// Обновляем статус платежа через PUT запрос
						await strapi
							.service('api::payment.payment')
							.update(payment[0].documentId, {
								data: { payment_status: object.status },
							})
					}
					break

				case 'payment.canceled':
					// Находим платеж по yookassa_id
					const canceledPayment = await strapi.entityService.findMany(
						'api::payment.payment',
						{
							filters: { yookassa_id: object.id },
						}
					)
					console.log(`canceledPayment: ${JSON.stringify(canceledPayment)}`)

					if (canceledPayment.length > 0) {
						console.log(`зашел в payment.canceled length > 0`)
						// Обновляем статус платежа через PUT запрос
						await strapi
							.service('api::payment.payment')
							.update(canceledPayment[0].documentId, {
								data: { payment_status: object.status },
							})
					}
					break

				case 'refund.succeeded':
					// Находим платеж по yookassa_id
					const refundPayment = await strapi.entityService.findMany(
						'api::payment.payment',
						{
							filters: { yookassa_id: object.id },
						}
					)

					console.log(`refundPayment: ${JSON.stringify(refundPayment)}`)

					if (refundPayment.length > 0) {
						console.log(`зашел в refund.succeeded length > 0`)
						// Обновляем статус возврата через PUT запрос
						await strapi
							.service('api::payment.payment')
							.update(refundPayment[0].documentId, {
								data: { refund_status: object.status },
							})
					}
					break
			}

			return this.transformResponse({ success: true })
		} catch (error) {
			console.error('Ошибка обработки вебхука:', error)
			return ctx.badRequest('Ошибка обработки вебхука')
		}
	},

	async asd(ctx) {
		try {
			const payment = await strapi.entityService.findMany(
				'api::payment.payment',
				{
					filters: { yookassa_id: '2f94c3a0-000f-5000-b000-1cef4805fa64' },
				}
			)

			console.log(`payment: ${JSON.stringify(payment)}`)

			if (payment.length > 0) {
				console.log(`зашел в payment.succeeded length > 0`)
				console.log(`payment[0].id: ${payment[0].id}`)

				// Обновляем статус платежа через PUT запрос
				const paymentUpdate = await strapi
					.service('api::payment.payment')
					.update(payment[0].documentId, {
						data: { payment_status: 'succeeded' },
					})

				console.log(`paymentUpdate: ${JSON.stringify(paymentUpdate)}`)
			}
		} catch (error) {
			console.error('Ошибка обновления статуса:', error)
			return ctx.badRequest('Ошибка обновления статуса')
		}

		return this.transformResponse({ testdata: 'asd' })
	},
}))
