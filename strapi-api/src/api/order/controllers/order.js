'use strict'

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
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
