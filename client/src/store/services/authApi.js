import { api } from '../api'
import cookiesService from '@/services/cookies'

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		// Регистрация пользователя
		register: builder.mutation({
			query: (userData) => ({
				url: '/auth/local/register',
				method: 'POST',
				body: userData,
			}),
			// Сохраняем токен в куки при успешной регистрации
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					const { data } = await queryFulfilled
					if (data.jwt) {
						cookiesService.setAuthToken(data.jwt)
					}
				} catch {}
			},
		}),

		// Вход пользователя
		login: builder.mutation({
			query: (credentials) => ({
				url: '/auth/local',
				method: 'POST',
				body: credentials,
			}),
			// Сохраняем токен в куки при успешном входе
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					const { data } = await queryFulfilled
					if (data.jwt) {
						cookiesService.setAuthToken(data.jwt)
					}
				} catch {}
			},
		}),

		// Получение данных текущего пользователя
		getUser: builder.query({
			query: () => '/api/users/me',
		}),

		// Обновление профиля пользователя
		updateProfile: builder.mutation({
			query: ({ id, userData }) => ({
				url: `/users/${id}`,
				method: 'PUT',
				body: userData,
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

		// Выход пользователя
		logout: builder.mutation({
			query: () => ({
				url: '/auth/logout',
				method: 'POST',
			}),
			// Удаляем токен из кук при выходе
			onQueryStarted: async (_, { queryFulfilled }) => {
				try {
					await queryFulfilled
					cookiesService.removeAuthToken()
				} catch {}
			},
		}),
	}),
})

export const {
	useRegisterMutation,
	useLoginMutation,
	useGetUserQuery,
	useUpdateProfileMutation,
	useForgotPasswordMutation,
	useResetPasswordMutation,
	useLogoutMutation,
} = authApi
