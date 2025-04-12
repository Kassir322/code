'use strict'

/**
 * category controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController(
	'api::category.category',
	({ strapi }) => ({
		async findOne(ctx) {
			const { id } = ctx.params

			// Пытаемся найти по числовому id
			const numericId = parseInt(id, 10)
			if (!isNaN(numericId)) {
				const category = await strapi.entityService.findOne(
					'api::category.category',
					numericId
				)

				if (!category) {
					return ctx.notFound('Category not found')
				}

				return this.transformResponse(category)
			}

			return ctx.notFound('Category not found')
		},
	})
)
