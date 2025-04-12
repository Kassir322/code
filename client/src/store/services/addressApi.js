import { api, handleAuthError } from '../api'

export const addressApi = api.injectEndpoints({
	endpoints: (builder) => ({
		// Получение списка адресов текущего пользователя
		getAddresses: builder.query({
			query: () => ({
				url: '/addresses',
				method: 'GET',
			}),
			// Обработка ошибок авторизации
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch (error) {
					handleAuthError(error)
				}
			},
			providesTags: ['Addresses'],
		}),

		// Получение адреса по ID
		getAddress: builder.query({
			query: (id) => ({
				url: `/addresses/${id}`,
				method: 'GET',
			}),
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch (error) {
					handleAuthError(error)
				}
			},
			providesTags: (result, error, id) => [{ type: 'Addresses', id }],
		}),

		// Создание нового адреса
		createAddress: builder.mutation({
			query: (data) => ({
				url: '/addresses',
				method: 'POST',
				body: data,
			}),
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch (error) {
					handleAuthError(error)
				}
			},
			invalidatesTags: ['Addresses'],
		}),

		// Обновление существующего адреса
		updateAddress: builder.mutation({
			query: ({ id, data }) => ({
				url: `/addresses/${id}`,
				method: 'PUT',
				body: data,
			}),
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch (error) {
					handleAuthError(error)
				}
			},
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Addresses', id },
				'Addresses',
			],
		}),

		// Удаление адреса
		deleteAddress: builder.mutation({
			query: (id) => ({
				url: `/addresses/${id}`,
				method: 'DELETE',
			}),
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch (error) {
					handleAuthError(error)
				}
			},
			invalidatesTags: ['Addresses'],
		}),

		// Установка адреса как основного
		setDefaultAddress: builder.mutation({
			query: (id) => ({
				url: `/addresses/${id}/default`,
				method: 'PUT',
			}),
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					await queryFulfilled
				} catch (error) {
					handleAuthError(error)
				}
			},
			invalidatesTags: ['Addresses'],
		}),
	}),
})

// Экспортируем хуки для использования API
export const {
	useGetAddressesQuery,
	useGetAddressQuery,
	useCreateAddressMutation,
	useUpdateAddressMutation,
	useDeleteAddressMutation,
	useSetDefaultAddressMutation,
} = addressApi
