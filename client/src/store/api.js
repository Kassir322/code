// src/store/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import cookiesService from '@/services/cookies'

// Базовый query с автоматическим добавлением токена
const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337',
	prepareHeaders: (headers) => {
		const token = cookiesService.getAuthToken()
		if (token) {
			headers.set('authorization', `Bearer ${token}`)
		}
		return headers
	},
	credentials: 'include',
})

// Создаем базовый API
export const api = createApi({
	reducerPath: 'api',
	baseQuery,
	endpoints: () => ({}),
	tagTypes: ['Products', 'Categories', 'Cart', 'Addresses', 'Orders'],
})

// Простой обработчик ошибок авторизации
export const handleAuthError = (error) => {
	// Проверяем на 401 ошибку (Unauthorized)
	if (error?.status === 401) {
		// Очищаем localStorage при ошибке авторизации
		localStorage.removeItem('token')
		localStorage.removeItem('user')

		// В реальном приложении здесь можно добавить редирект на страницу входа
		if (typeof window !== 'undefined') {
			window.location.href = '/account/login'
		}
	}
	return error
}
