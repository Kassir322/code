'use strict'

/**
 * address router
 */
module.exports = {
	routes: [
		{
			method: 'POST',
			path: '/addresses/:id/set-default',
			handler: 'address.setDefault',
		},
	],
}
