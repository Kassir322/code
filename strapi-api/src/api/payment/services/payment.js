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
				console.log('Создание платежа в ЮKassa:', {
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
						description: `Оплата заказа #${paymentData.order}`,
						metadata: {
							order_id: paymentData.order,
							user_id: paymentData.user_id,
						},
						// Добавляем срок действия платежа (24 часа)
						expires_at: new Date(
							Date.now() + 24 * 60 * 60 * 1000
						).toISOString(),
					},
					idempotencyKey // Используем переданный ключ идемпотентности
				)

				// console.log('Платеж создан:', {
				// 	payment_id: payment.id,
				// 	status: payment.status,
				// })

				console.log('Платеж создан:', payment)

				return payment
			} catch (error) {
				console.error('Ошибка создания платежа:', error)
				return { error: error.message, details: error }
			}
		},

		/**
		 * Получение URL чека из ЮKassa
		 * @param {string} paymentId - ID платежа
		 */
		async getReceiptUrl(paymentId) {
			try {
				const receipt = await this.yooKassa.getReceipt(paymentId)
				return receipt.receipt_url
			} catch (error) {
				console.error('Ошибка получения URL чека:', error)
				return { error: error.message, details: error }
			}
		},

		/**
		 * Создание возврата платежа
		 * @param {string} paymentId - ID платежа
		 * @param {number} amount - Сумма возврата
		 * @param {string} reason - Причина возврата
		 * @param {string} idempotencyKey - Ключ идемпотентности
		 */
		async createRefund(paymentId, amount, reason, idempotencyKey) {
			try {
				const refund = await this.yooKassa.createRefund(
					{
						payment_id: paymentId,
						amount: {
							value: amount,
							currency: 'RUB',
						},
						description: reason,
					},
					idempotencyKey
				)

				console.log('Возврат создан:', {
					refund_id: refund.id,
					status: refund.status,
				})

				return refund
			} catch (error) {
				console.error('Ошибка создания возврата:', error)
				return { error: error.message, details: error }
			}
		},

		/**
		 * Получение информации о возврате
		 * @param {string} refundId - ID возврата
		 */
		async getRefundInfo(refundId) {
			try {
				return await this.yooKassa.getRefund(refundId)
			} catch (error) {
				console.error('Ошибка получения информации о возврате:', error)
				return { error: error.message, details: error }
			}
		},

		/**
		 * Получение чека из ЮKassa
		 * @param {string} paymentId - ID платежа
		 */
		async getYookassaReceipt(paymentId) {
			try {
				return await this.yooKassa.getReceipt(paymentId)
			} catch (error) {
				console.error('Ошибка получения чека:', error)
				return { error: error.message, details: error }
			}
		},

		/**
		 * Получение информации о платеже из ЮKassa
		 */
		async getYookassaPayment(paymentId) {
			try {
				return await this.yooKassa.getPayment(paymentId)
			} catch (error) {
				console.error('Ошибка получения информации о платеже:', error)
				return { error: error.message, details: error }
			}
		},
	})
)
