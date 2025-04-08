import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Базовый URL для API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'

// Создаем основной API с базовой конфигурацией
export const api = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers) => {
			// Добавляем токен авторизации если нужно
			const token = process.env.NEXT_PUBLIC_API_TOKEN
			if (token) {
				headers.set('Authorization', `Bearer ${token}`)
			}
			return headers
		},
	}),
	endpoints: () => ({}), // Эндпоинты будут добавлены в отдельных файлах
	tagTypes: ['Products', 'Categories', 'Cart'], // Определяем типы тегов для инвалидации кэша
})
