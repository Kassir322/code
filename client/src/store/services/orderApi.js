// src/store/services/orderApi.js
import { api, handleAuthError } from '../api'

export const orderApi = api.injectEndpoints({
	endpoints: (builder) => ({
		// Создание заказа
		createOrder: builder.mutation({
			query: (orderData) => ({
				url: '/api/orders',
				method: 'POST',
				body: { data: orderData },
			}),
			// Обработка ошибок авторизации
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch (error) {
					handleAuthError(error)
				}
			},
			invalidatesTags: ['Orders'],
		}),

		// Получение списка заказов пользователя
		getUserOrders: builder.query({
			query: () => ({
				url: '/api/orders/me',
				method: 'GET',
			}),
			transformResponse: (response) => response.data,
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch (error) {
					handleAuthError(error)
				}
			},
			providesTags: ['Orders'],
		}),

		// Получение детальной информации о заказе
		getOrderDetails: builder.query({
			query: (orderId) => ({
				url: `/api/orders/${orderId}`,
				method: 'GET',
			}),
			transformResponse: (response) => response.data,
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch (error) {
					handleAuthError(error)
				}
			},
			providesTags: (result, error, id) => [{ type: 'Orders', id }],
		}),
	}),
})

// Экспортируем хуки для использования API
export const {
	useCreateOrderMutation,
	useGetUserOrdersQuery,
	useGetOrderDetailsQuery,
} = orderApi
