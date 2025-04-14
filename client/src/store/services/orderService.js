// src/services/orderService.js
import { useCreateOrderMutation } from '@/store/services/orderApi'

/**
 * Сервис для работы с заказами
 */
export const useOrderService = () => {
	const [createOrder, { isLoading: isCreatingOrder, error: createOrderError }] =
		useCreateOrderMutation()

	/**
	 * Создает заказ на основе данных из корзины
	 * @param {Object} orderData - Данные заказа
	 * @returns {Promise<{success: boolean, orderId: number, error: string}>}
	 */
	const placeOrder = async (orderData) => {
		try {
			const {
				shipping_method,
				payment_method,
				shipping_address,
				items,
				notes,
			} = orderData

			// Проверяем наличие обязательных полей
			if (
				!shipping_method ||
				!payment_method ||
				!shipping_address ||
				!items ||
				items.length === 0
			) {
				return {
					success: false,
					error: 'Не все обязательные поля заполнены',
				}
			}

			// Формируем данные для отправки на сервер
			const payload = {
				shipping_method,
				payment_method,
				shipping_address,
				items: items.map((item) => ({
					study_card_id: item.id, // ID товара
					quantity: item.quantity, // Количество
				})),
				notes,
			}

			// Отправляем запрос на создание заказа
			const response = await createOrder(payload).unwrap()

			// Проверяем структуру ответа, учитывая особенности Strapi API
			if (response && (response.id || (response.data && response.data.id))) {
				return {
					success: true,
					orderId: response.id || response.data.id,
				}
			}

			console.error('Неожиданная структура ответа:', response)
			return {
				success: false,
				error: 'Не удалось создать заказ: неверный формат ответа',
			}
		} catch (error) {
			console.error('Ошибка при создании заказа:', error)
			return {
				success: false,
				error:
					error.data?.error?.message || 'Произошла ошибка при создании заказа',
			}
		}
	}

	return {
		placeOrder,
		isCreatingOrder,
		createOrderError,
	}
}
