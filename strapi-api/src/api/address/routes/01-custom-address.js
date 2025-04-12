'use strict'

/**
 * Кастомные маршруты для адресов
 */

module.exports = {
	routes: [
		{
			method: 'POST',
			path: '/addresses/:id/set-default',
			handler: 'address.setDefault',
			config: {},
		},
	],
}
