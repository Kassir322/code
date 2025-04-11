import { api } from '../api'

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		// Регистрация пользователя
		register: builder.mutation({
			query: (userData) => ({
				url: '/auth/local/register',
				method: 'POST',
				body: userData,
			}),
		}),

		// Вход пользователя
		login: builder.mutation({
			query: (credentials) => ({
				url: '/auth/local',
				method: 'POST',
				body: credentials,
			}),
			// Обработка успешного ответа для сохранения токена и данных пользователя
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					const { data } = await queryFulfilled
					// Сохраняем токен и данные пользователя в localStorage
					localStorage.setItem('token', data.jwt)
					localStorage.setItem('user', JSON.stringify(data.user))
				} catch (error) {
					// Ошибка при авторизации, ничего не делаем
				}
			},
		}),

		// Получение данных текущего пользователя
		getCurrentUser: builder.query({
			query: () => ({
				url: '/users/me',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}),
			// Не отправляем запрос, если токен отсутствует
			skip: () => !localStorage.getItem('token'),
		}),

		// Обновление профиля пользователя
		updateProfile: builder.mutation({
			query: ({ id, userData }) => ({
				url: `/users/${id}`,
				method: 'PUT',
				body: userData,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			}),
		}),

		// Запрос на восстановление пароля
		forgotPassword: builder.mutation({
			query: (email) => ({
				url: '/auth/forgot-password',
				method: 'POST',
				body: { email },
			}),
		}),

		// Сброс пароля
		resetPassword: builder.mutation({
			query: (data) => ({
				url: '/auth/reset-password',
				method: 'POST',
				body: data,
			}),
		}),
	}),
})

export const {
	useRegisterMutation,
	useLoginMutation,
	useGetCurrentUserQuery,
	useUpdateProfileMutation,
	useForgotPasswordMutation,
	useResetPasswordMutation,
} = authApi
