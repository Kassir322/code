'use strict'

/**
 * Кастомные маршруты для заказов
 */

module.exports = {
	routes: [
		{
			method: 'GET',
			path: '/orders/me',
			handler: 'order.findMe',
			config: {
				policies: ['api::order.is-auth'], // Предполагается, что у вас есть политика для проверки авторизации
			},
		},
	],
}
