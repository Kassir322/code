'use strict'

const { YooCheckout } = require('@a2seven/yoo-checkout')
const crypto = require('crypto')

/**
 * payment service
 */

const createStrapi = require('@strapi/strapi').factories

module.exports = createStrapi.createCoreService(
	'api::payment.payment',
	({ strapi }) => ({
		// Инициализация YooKassa SDK
		yooKassa: new YooCheckout({
			shopId: process.env.YOOKASSA_SHOP_ID,
			secretKey: process.env.YOOKASSA_SECRET_KEY,
		}),

		/**
		 * Создание платежа в ЮKassa
		 * @param {Object} paymentData - Данные платежа
		 * @param {string} idempotencyKey - Ключ идемпотентности
		 */
		async createYookassaPayment(paymentData, idempotencyKey) {
			try {
				strapi.log.debug('Creating YooKassa payment', {
					...paymentData,
					idempotencyKey,
				})

				// Создаем платеж с ключом идемпотентности
				const payment = await this.yooKassa.createPayment(
					{
						amount: {
							value: paymentData.amount.value,
							currency: paymentData.amount.currency,
						},
						confirmation: {
							type: paymentData.payment_method === 'sbp' ? 'qr' : 'redirect',
							return_url: paymentData.return_url,
						},
						capture: true, // Автоматический захват платежа
						description: `Оплата заказа #${paymentData.order_id}`,
						metadata: {
							order_id: paymentData.order_id,
							user_id: paymentData.user_id,
						},
					},
					idempotencyKey // Используем переданный ключ идемпотентности
				)

				strapi.log.debug('YooKassa payment created', {
					payment_id: payment.id,
					status: payment.status,
				})

				return payment
			} catch (error) {
				strapi.log.error('YooKassa payment creation error:', error)
				throw error
			}
		},

		/**
		 * Проверка подписи вебхука от ЮKassa
		 */
		async verifyWebhookSignature(body, signature) {
			if (!signature) {
				return false
			}

			try {
				// Парсим сигнатуру
				const [version, hash, salt] = signature.split(' ')

				if (version !== 'v1') {
					return false
				}

				// Формируем строку для проверки
				const data = `${salt}.${JSON.stringify(body)}`

				// Вычисляем HMAC
				const calculatedHash = crypto
					.createHmac('sha256', process.env.YOOKASSA_WEBHOOK_SECRET)
					.update(data)
					.digest('hex')

				return hash === calculatedHash
			} catch (error) {
				console.error('Webhook signature verification error:', error)
				return false
			}
		},

		/**
		 * Получение информации о платеже из ЮKassa
		 */
		async getYookassaPayment(paymentId) {
			try {
				return await this.yooKassa.getPayment(paymentId)
			} catch (error) {
				console.error('YooKassa payment info error:', error)
				throw error
			}
		},
	})
)
