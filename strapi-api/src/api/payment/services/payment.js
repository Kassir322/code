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
		 */
		async createYookassaPayment({
			amount,
			payment_method,
			order_id,
			user_id,
			return_url,
		}) {
			try {
				// Создаем платеж
				const payment = await this.yooKassa.createPayment(
					{
						amount: {
							value: amount.value,
							currency: amount.currency,
						},
						confirmation: {
							type: payment_method === 'sbp' ? 'qr' : 'redirect',
							return_url: return_url,
						},
						capture: true, // Автоматический захват платежа
						description: `Оплата заказа #${order_id}`,
						metadata: {
							order_id: order_id,
							user_id: user_id,
						},
					},
					crypto.randomUUID() // Идемпотентный ключ
				)

				return payment
			} catch (error) {
				console.error('YooKassa payment creation error:', error)
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
