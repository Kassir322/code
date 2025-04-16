'use strict'

/**
 * Middleware для обработки идемпотентности запросов
 * https://yookassa.ru/developers/using-api/interaction-format#idempotence
 */

const crypto = require('crypto')

module.exports = (config, { strapi }) => {
	return async (ctx, next) => {
		// Проверяем, что это POST или DELETE запрос
		if (!['POST', 'DELETE'].includes(ctx.request.method)) {
			return await next()
		}

		// Получаем ключ идемпотентности из заголовка
		let idempotencyKey = ctx.request.header['idempotence-key']

		// Если ключ не предоставлен, генерируем новый
		if (!idempotencyKey) {
			idempotencyKey = crypto.randomUUID()
			ctx.set('X-Generated-Idempotency-Key', idempotencyKey)
		}

		// Проверяем длину ключа (максимум 64 символа)
		if (idempotencyKey.length > 64) {
			return ctx.badRequest('Idempotence key is too long')
		}

		try {
			// Получаем все платежи и фильтруем в памяти
			const payments = await strapi.db.query('api::payment.payment').findMany({
				orderBy: { createdAt: 'desc' },
			})

			// Ищем платеж с нужным ключом идемпотентности
			const existingPayment = payments.find((payment) => {
				try {
					return payment.metadata?.idempotency_key === idempotencyKey
				} catch (e) {
					return false
				}
			})

			if (existingPayment) {
				strapi.log.debug(
					`Found existing payment for idempotency key: ${idempotencyKey}`,
					{ payment_id: existingPayment.id }
				)
				// Возвращаем сохраненный ответ
				return ctx.send(existingPayment)
			}

			// Сохраняем ключ идемпотентности в контексте для использования в контроллере
			ctx.state.idempotencyKey = idempotencyKey

			// Продолжаем обработку запроса
			await next()
		} catch (error) {
			strapi.log.error('Idempotency check error:', error)
			return ctx.throw(500, error)
		}
	}
}
