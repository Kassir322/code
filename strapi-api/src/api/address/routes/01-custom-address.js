'use strict'

/**
 * Кастомные маршруты для адресов
 */

module.exports = {
	routes: [
		{
			method: 'PUT',
			path: '/addresses/:id/set-default',
			handler: 'address.setDefault',
			config: {
				policies: [],
				middlewares: [],
			},
		},
	],
}
