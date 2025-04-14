'use strict'

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
	/**
	 * Создание заказа
	 * @param {Object} ctx - Контекст Koa
	 * @example
	 * // Тело запроса для создания заказа:
	 * {
	 *   "data": {
	 *     "total_amount": 1500,
	 *     "order_status": "pending"
	 *   }
	 * }
	 */
	async create(ctx) {
		const { data } = ctx.request.body
		const user = ctx.state.user

		// console.log(`${JSON.stringify(data)}`)

		if (!user) {
			return ctx.unauthorized('User not authenticated')
		}

		// Проверяем наличие обязательных полей
		if (
			!data ||
			!data.items ||
			!data.shipping_method ||
			!data.payment_method ||
			!data.shipping_address
		) {
			return ctx.badRequest('Не все обязательные поля заполнены')
		}

		// Проверяем, что items - это массив и он не пустой
		if (!Array.isArray(data.items) || data.items.length === 0) {
			return ctx.badRequest('В заказе должны быть товары')
		}

		// Получаем все ID карточек для поиска в базе данных
		const studyCardIds = data.items.map((item) => item.study_card_id)

		// Получаем актуальные данные о ценах товаров из базы данных
		const studyCards = await strapi.entityService.findMany(
			'api::study-card.study-card',
			{
				filters: {
					id: { $in: studyCardIds },
					is_active: true, // Проверяем, что товары активны
				},
				fields: ['id', 'price', 'quantity'],
			}
		)

		// Проверяем, что все запрошенные товары найдены
		if (studyCards.length !== studyCardIds.length) {
			return ctx.badRequest('Некоторые товары не найдены или недоступны')
		}
		console.log(`studyCards: ${JSON.stringify(studyCards)}`)

		// Создаем карту для быстрого доступа к ценам и остаткам
		const studyCardMap = studyCards.reduce((map, card) => {
			map[card.id] = { price: card.price, quantity: card.quantity }
			return map
		}, {})

		// Проверяем наличие товаров в достаточном количестве
		for (const item of data.items) {
			const cardInfo = studyCardMap[item.study_card_id]

			if (!cardInfo) {
				return ctx.badRequest(`Товар с ID ${item.study_card_id} не найден`)
			}

			// Проверяем остаток товара
			if (cardInfo.quantity < item.quantity) {
				return ctx.badRequest(
					`Недостаточное количество товара "${item.study_card_id}". Доступно: ${cardInfo.quantity}, запрошено: ${item.quantity}`
				)
			}
		}

		// Рассчитываем общую стоимость заказа
		let totalAmount = 0

		// Создаем массив для элементов заказа
		const orderItems = []

		for (const item of data.items) {
			const cardInfo = studyCardMap[item.study_card_id]
			const itemPrice = cardInfo.price
			const itemTotal = itemPrice * item.quantity

			totalAmount += itemTotal

			// Добавляем элемент в массив для последующего создания
			orderItems.push({
				study_card: item.study_card_id,
				quantity: item.quantity,
				price: itemPrice,
			})
		}

		//===========!!!!!! ДОБАВИТЬ МОДЕЛЬ ДОСТАВКИ (SHIPPING) !!!!!!!============
		// Добавляем стоимость доставки, если она предоставлена
		// if (data.shipping_cost && !isNaN(parseFloat(data.shipping_cost))) {
		// 	totalAmount += parseFloat(data.shipping_cost)
		// }

		try {
			// создаем заказ
			const order = await strapi.entityService.create('api::order.order', {
				data: {
					total_amount: totalAmount,
					order_status: 'pending',
					payment_method: data.payment_method,
					shipping_method: data.shipping_method,
					shipping_address: data.shipping_address,
					notes: data.notes,
					user: user.id, // Привязываем заказ к текущему пользователю
					publishedAt: new Date(),
				},
			})

			// Создаем элементы заказа и связываем их с заказом
			for (const item of orderItems) {
				await strapi.entityService.create('api::order-item.order-item', {
					data: {
						...item,
						order: order.id,
						publishedAt: new Date(),
					},
				})
			}

			// Обновляем количество товаров в наличии
			for (const item of data.items) {
				const cardInfo = studyCardMap[item.study_card_id]

				await strapi.entityService.update(
					'api::study-card.study-card',
					item.study_card_id,
					{
						data: {
							quantity: cardInfo.quantity - item.quantity,
						},
					}
				)
			}

			// Получаем созданный заказ с связанными элементами
			const populatedOrder = await strapi.entityService.findOne(
				'api::order.order',
				order.id,
				{
					populate: ['user', 'order_items', 'shipping_address'],
				}
			)

			return this.transformResponse(populatedOrder)
		} catch (error) {
			console.error('Order creation error:', error)
			ctx.throw(500, error)
		}

		// try {
		// 	const order = await strapi.entityService.create('api::order.order', {
		// 		data: {
		// 			...data,
		// 			user: user.id,
		// 			publishedAt: new Date(),
		// 		},
		// 	})

		// 	return this.transformResponse(order)
		// } catch (error) {
		// 	console.error('Order creation error:', error)
		// 	ctx.throw(500, error)
		// }
	},

	async findOne(ctx) {
		const { id } = ctx.params

		// Пытаемся найти по числовому id
		const numericId = parseInt(id, 10)
		if (!isNaN(numericId)) {
			const order = await strapi.entityService.findOne(
				'api::order.order',
				numericId,
				{
					populate: ['user'],
				}
			)

			if (!order) {
				return ctx.notFound('Order not found')
			}

			console.log(order)

			return this.transformResponse(order)
		}

		return ctx.notFound('Order not found')
	},

	async findMe(ctx) {
		try {
			const { user } = ctx.state

			if (!user) {
				return ctx.unauthorized('Вы должны быть авторизованы')
			}

			const orders = await strapi.entityService.findMany('api::order.order', {
				filters: {
					user: user.id,
				},
				sort: { createdAt: 'desc' },
				populate: {
					order_items: {
						populate: ['study_card'],
					},
					shipping_address: true,
				},
			})

			return this.transformResponse(orders)
		} catch (error) {
			console.error('Ошибка при получении заказов:', error)
			return ctx.internalServerError('Произошла ошибка при получении заказов')
		}
	},
}))
