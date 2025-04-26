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

	async create(ctx) {
		// Проверяем авторизацию
		if (!ctx.state.user) {
			return ctx.unauthorized('You must be logged in to create a review')
		}

		// Получаем данные из запроса
		const { rating, comment, study_card } = ctx.request.body.data

		// Создаем отзыв с автоматическим добавлением пользователя
		const review = await strapi.entityService.create('api::review.review', {
			data: {
				rating,
				comment,
				study_card,
				users_permissions_user: ctx.state.user.id,
			},
			populate: ['users_permissions_user', 'study_card'],
		})

		return this.transformResponse(review)
	},
}))
