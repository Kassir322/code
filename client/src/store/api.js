// src/store/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Базовый URL для API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'

// Создаем основной API с базовой конфигурацией
export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers) => {
			// Добавляем токен авторизации если он есть
			const token = localStorage.getItem('token')
			if (token) {
				headers.set('Authorization', `Bearer ${token}`)
			}
			return headers
		},
	}),
	endpoints: () => ({}),
	tagTypes: ['Products', 'Categories', 'Cart'],
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
