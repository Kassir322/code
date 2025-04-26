// src/lib/auth.js
import cookiesService from '@/services/cookies'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'

export const registerUser = async (userData) => {
	try {
		const response = await fetch(`${baseUrl}/api/auth/local/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(
				data.error?.message || 'Ошибка при регистрации пользователя'
			)
		}

		// Сохраняем данные пользователя в localStorage
		localStorage.setItem('user', JSON.stringify(data.user))

		// Сохраняем токен через cookiesService
		if (data.jwt) {
			cookiesService.setAuthToken(data.jwt)
		}

		return data
	} catch (error) {
		console.error('Ошибка при регистрации:', error)
		throw error
	}
}

export const loginUser = async (credentials) => {
	try {
		const apiUrl = `${baseUrl}/api/auth/local`

		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				identifier: credentials.identifier,
				password: credentials.password,
			}),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.error?.message || 'Ошибка при входе в систему')
		}

		// Сохраняем данные пользователя в localStorage
		localStorage.setItem('user', JSON.stringify(data.user))

		// Сохраняем токен через cookiesService
		cookiesService.setAuthToken(data.jwt)

		return data
	} catch (error) {
		console.error('Ошибка при входе:', error)
		throw error
	}
}

export const logoutUser = () => {
	// Удаляем данные пользователя из localStorage
	localStorage.removeItem('user')

	// Удаляем токен через cookiesService
	cookiesService.removeAuthToken()
}

export const validateToken = async () => {
	try {
		// Получаем токен через cookiesService
		const token = cookiesService.getAuthToken()
		if (!token) return false

		const response = await fetch(`${baseUrl}/api/users/me?populate=*`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) return false

		const userData = await response.json()
		localStorage.setItem('user', JSON.stringify(userData))
		return true
	} catch (error) {
		console.error('Ошибка при валидации токена:', error)
		return false
	}
}

export const getCurrentUser = async () => {
	try {
		const token = cookiesService.getAuthToken()
		if (!token) return null

		const response = await fetch(`${baseUrl}/api/users/me?populate=*`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		if (!response.ok) {
			throw new Error('Ошибка при получении данных пользователя')
		}

		const userData = await response.json()
		return userData
	} catch (error) {
		console.error('Ошибка при получении данных пользователя:', error)
		return null
	}
}
