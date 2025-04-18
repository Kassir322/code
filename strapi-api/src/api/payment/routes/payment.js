'use strict'

/**
 * payment router
 */

const { createCoreRouter } = require('@strapi/strapi').factories

module.exports = {
	routes: [
		// {
		// 	method: 'GET',
		// 	path: '/payments/asd',
		// 	handler: 'payment.asd',
		// },
		// Создание платежа (только для авторизованных)
		{
			method: 'POST',
			path: '/payments',
			handler: 'payment.create',
			config: {
				policies: ['api::payment.is-auth'],
				middlewares: ['api::payment.idempotency'],
			},
		},
		// Получение информации о платеже (только для авторизованных)
		{
			method: 'GET',
			path: '/payments/:id',
			handler: 'payment.findOne',
			config: {
				policies: ['api::payment.is-auth'],
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
		// Обновление платежа (только для вебхука)
		{
			method: 'PUT',
			path: '/payments/:id',
			handler: 'payment.update',
			config: {
				middlewares: ['api::payment.yookassa-ip-filter'],
			},
		},
	],
}
