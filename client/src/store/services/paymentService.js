// src/services/paymentService.js
import { useCreatePaymentMutation } from '@/store/services/paymentApi'

/**
 * Сервис для работы с платежами
 */
export const usePaymentService = () => {
	const [createPayment, { isLoading: isCreatingPayment }] =
		useCreatePaymentMutation()

	/**
	 * Создает платеж и возвращает URL для оплаты
	 * @param {Object} orderData - Данные заказа
	 * @returns {Promise<{success: boolean, confirmationUrl: string, paymentId: string}>}
	 */
	const initiatePayment = async (orderData) => {
		try {
			const {
				amount,
				description,
				items,
				paymentMethod = 'yookassa_redirect',
			} = orderData

			const payload = {
				amount,
				description: description || `Заказ в интернет-магазине Mat-Focus`,
				payment_method: paymentMethod,
				metadata: { items },
			}

			const response = await createPayment(payload).unwrap()
			console.log(response)

			// Если платеж создан успешно, возвращаем URL для перенаправления
			if (response.data) {
				return {
					success: true,
					confirmationUrl: response.data.confirmation_url,
					paymentId: response.data.id,
				}
			}

			return { success: false, error: 'Не удалось получить данные для оплаты' }
		} catch (error) {
			console.error('Ошибка при создании платежа:', error)
			return {
				success: false,
				error:
					error.data?.error?.message || 'Произошла ошибка при создании платежа',
			}
		}
	}

	return {
		initiatePayment,
		isCreatingPayment,
	}
}
