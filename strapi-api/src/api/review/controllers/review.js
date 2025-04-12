// В strapi-api/src/api/review/controllers/review.js
'use strict'

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::review.review', ({ strapi }) => ({
	async findOne(ctx) {
		const { id } = ctx.params

		// Пытаемся найти по documentId
		let review = false

		// Если не нашли по documentId, пробуем найти по числовому id
		if (!review) {
			const numericId = parseInt(id, 10)
			if (!isNaN(numericId)) {
				review = await strapi.entityService.findOne(
					'api::review.review',
					numericId
				)
			}
		}

		if (!review) {
			return ctx.notFound('Review not found')
		}

		return this.transformResponse(review)
	},
}))
