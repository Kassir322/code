// src/store/services/paymentApi.js
import { api, handleAuthError } from '../api'

export const paymentApi = api.injectEndpoints({
	endpoints: (builder) => ({
		// Создание платежа
		createPayment: builder.mutation({
			query: (paymentData) => ({
				url: '/api/payments',
				method: 'POST',
				body: paymentData,
			}),
			// Обработка ошибок авторизации
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch (error) {
					handleAuthError(error)
				}
			},
		}),

		// Получение информации о платеже по ID
		getPayment: builder.query({
			query: (id) => ({
				url: `/api/payments/${id}`,
				method: 'GET',
			}),
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch (error) {
					handleAuthError(error)
				}
			},
		}),

		// Получение списка платежей пользователя
		getUserPayments: builder.query({
			query: () => ({
				url: '/api/payments/me',
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
			providesTags: ['Payments'],
		}),

		// Проверка статуса платежа
		checkPaymentStatus: builder.query({
			query: (paymentId) => ({
				url: `/api/payments/${paymentId}/status`,
				method: 'GET',
			}),
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch (error) {
					handleAuthError(error)
				}
			},
		}),
	}),
})

// Экспортируем хуки для использования API
export const {
	useCreatePaymentMutation,
	useGetPaymentQuery,
	useGetUserPaymentsQuery,
	useCheckPaymentStatusQuery,
} = paymentApi
