'use strict'

/**
 * study-card controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController(
	'api::study-card.study-card',
	({ strapi }) => ({
		async findOne(ctx) {
			const { id } = ctx.params
			const { populate } = ctx.query

			// Пытаемся найти по числовому id
			const numericId = parseInt(id, 10)
			if (!isNaN(numericId)) {
				const studyCard = await strapi.entityService.findOne(
					'api::study-card.study-card',
					numericId,
					{
						populate: populate || ['category'],
					}
				)

				if (!studyCard) {
					return ctx.notFound('Study card not found')
				}

				return this.transformResponse(studyCard)
			}

			return ctx.notFound('Study card not found')
		},
	})
)
