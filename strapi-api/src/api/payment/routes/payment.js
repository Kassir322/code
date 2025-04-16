'use strict'

/**
 * payment router
 */

const { createCoreRouter } = require('@strapi/strapi').factories

module.exports = {
	routes: [
		// Создание платежа (только для авторизованных)
		{
			method: 'POST',
			path: '/payments',
			handler: 'payment.create',
			config: {
				policies: ['global::is-auth'],
				middlewares: ['api::payment.idempotency'],
			},
		},
		// Получение информации о платеже (только для авторизованных)
		{
			method: 'GET',
			path: '/payments/:id',
			handler: 'payment.findOne',
			config: {
				policies: ['global::is-auth'],
			},
		},
		// Вебхук от ЮKassa (с проверкой IP)
		{
			method: 'POST',
			path: '/payments/webhook',
			handler: 'payment.webhook',
			config: {
				middlewares: ['api::payment.yookassa-ip-filter'],
			},
		},
	],
}
