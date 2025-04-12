'use strict'

/**
 * order-item controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController(
	'api::order-item.order-item',
	({ strapi }) => ({
		async findOne(ctx) {
			const { id } = ctx.params

			// Пытаемся найти по числовому id
			const numericId = parseInt(id, 10)
			if (!isNaN(numericId)) {
				const orderItem = await strapi.entityService.findOne(
					'api::order-item.order-item',
					numericId
				)

				if (!orderItem) {
					return ctx.notFound('Order item not found')
				}

				return this.transformResponse(orderItem)
			}

			return ctx.notFound('Order item not found')
		},
	})
)
