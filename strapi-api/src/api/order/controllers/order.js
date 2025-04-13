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

		if (!user) {
			return ctx.unauthorized('User not authenticated')
		}

		try {
			const order = await strapi.entityService.create('api::order.order', {
				data: {
					...data,
					user: user.id,
					publishedAt: new Date(),
				},
			})

			return this.transformResponse(order)
		} catch (error) {
			console.error('Order creation error:', error)
			ctx.throw(500, error)
		}
	},

	async findOne(ctx) {
		const { id } = ctx.params

		// Пытаемся найти по числовому id
		const numericId = parseInt(id, 10)
		if (!isNaN(numericId)) {
			const order = await strapi.entityService.findOne(
				'api::order.order',
				numericId
			)

			if (!order) {
				return ctx.notFound('Order not found')
			}

			return this.transformResponse(order)
		}

		return ctx.notFound('Order not found')
	},
}))
