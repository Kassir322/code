'use strict'

/**
 * Middleware для проверки IP-адресов ЮKassa
 * https://yookassa.ru/developers/using-api/webhooks
 */

const ALLOWED_IPS = [
	'185.71.76.0/27',
	'185.71.77.0/27',
	'77.75.153.0/25',
	'77.75.156.11',
	'77.75.156.35',
	'77.75.154.128/25',
	'2a02:5180::/32',
]

const ipRangeCheck = require('ip-range-check')

module.exports = (config, { strapi }) => {
	return async (ctx, next) => {
		const clientIp = ctx.request.ip

		// Пропускаем в dev режиме
		if (process.env.NODE_ENV === 'development') {
			strapi.log.debug('YooKassa IP check skipped in development mode')
			return await next()
		}

		// Проверяем IP
		const isAllowed = ALLOWED_IPS.some((range) => ipRangeCheck(clientIp, range))

		if (!isAllowed) {
			strapi.log.warn(`Blocked request from unauthorized IP: ${clientIp}`)
			return ctx.forbidden('IP not allowed')
		}

		strapi.log.debug(`Allowed YooKassa webhook from IP: ${clientIp}`)
		await next()
	}
}
