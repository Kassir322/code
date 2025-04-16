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

/**
 * Получает реальный IP-адрес клиента с учетом прокси
 * @param {object} ctx - Koa контекст
 * @returns {string} IP-адрес клиента
 */
const getClientIp = (ctx) => {
	// Проверяем X-Forwarded-For
	const forwardedIp = ctx.request.get('x-forwarded-for')
	if (forwardedIp) {
		// Берем первый IP из списка (самый дальний клиент)
		return forwardedIp.split(',')[0].trim()
	}

	// Проверяем X-Real-IP
	const realIp = ctx.request.get('x-real-ip')
	if (realIp) {
		return realIp
	}

	// Если нет прокси-заголовков, возвращаем обычный IP
	return ctx.request.ip
}

module.exports = (config, { strapi }) => {
	return async (ctx, next) => {
		const clientIp = getClientIp(ctx)
		console.log('clientIp', clientIp)

		// Пропускаем в dev режиме
		if (process.env.NODE_ENV === 'development') {
			console.log('YooKassa IP check skipped in development mode')
			console.log(
				`isAllowed: ${ALLOWED_IPS.some((range) => ipRangeCheck(clientIp, range))}`
			)

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
