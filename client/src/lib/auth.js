/**
 * Сервисные функции для работы с авторизацией
 */

// Базовый URL для API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'

/**
 * Функция для регистрации нового пользователя
 */
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

		return data
	} catch (error) {
		console.error('Ошибка при регистрации:', error)
		throw error
	}
}

/**
 * Функция для входа пользователя
 */
export const loginUser = async (credentials) => {
	try {
		const apiUrl = `${baseUrl}/api/auth/local`
		console.log('Вызов loginUser:', {
			url: apiUrl,
			credentials: { ...credentials, password: '***' }, // Скрываем пароль в логах
		})

		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials),
		})

		const data = await response.json()
		console.log('Ответ от сервера:', data)

		if (!response.ok) {
			throw new Error(data.error?.message || 'Ошибка при входе в систему')
		}

		// Сохраняем токен и данные пользователя в localStorage
		if (data.jwt) {
			console.log('Сохраняем токен в localStorage')
			localStorage.setItem('token', data.jwt)
			localStorage.setItem('user', JSON.stringify(data.user))
			console.log('Токен успешно сохранен')
		}

		return data
	} catch (error) {
		console.error('Ошибка при входе:', error)
		throw error
	}
}

/**
 * Функция для выхода пользователя из системы
 */
export const logoutUser = () => {
	// Удаляем токен и данные пользователя из localStorage
	localStorage.removeItem('token')
	localStorage.removeItem('user')
}

/**
 * Функция для получения текущего пользователя из localStorage
 */
export const getCurrentUser = () => {
	try {
		const token = localStorage.getItem('token')
		const user = localStorage.getItem('user')

		if (!token || !user) {
			return null
		}

		return JSON.parse(user)
	} catch (error) {
		console.error('Ошибка при получении данных пользователя:', error)
		return null
	}
}

/**
 * Функция для проверки валидности токена
 */
export const validateToken = async () => {
	try {
		const token = localStorage.getItem('token')

		if (!token) {
			return false
		}

		const response = await fetch(`${baseUrl}/api/users/me`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		return response.ok
	} catch (error) {
		console.error('Ошибка при валидации токена:', error)
		return false
	}
}

/**
 * Функция для запроса восстановления пароля
 */
export const forgotPassword = async (email) => {
	try {
		const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(
				data.error?.message ||
					'Ошибка при отправке запроса на восстановление пароля'
			)
		}

		return data
	} catch (error) {
		console.error('Ошибка при запросе восстановления пароля:', error)
		throw error
	}
}

/**
 * Функция для сброса пароля
 */
export const resetPassword = async (passwordData) => {
	try {
		const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(passwordData),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.error?.message || 'Ошибка при сбросе пароля')
		}

		return data
	} catch (error) {
		console.error('Ошибка при сбросе пароля:', error)
		throw error
	}
}
