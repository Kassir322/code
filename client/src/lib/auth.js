/**
 * Сервисные функции для работы с авторизацией
 */

// Базовый URL для API
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'

/**
 * Функция для регистрации нового пользователя
 * @param {Object} userData - Данные пользователя для регистрации
 * @returns {Promise<Object>} - Ответ сервера
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
 * @param {Object} credentials - Учетные данные пользователя
 * @returns {Promise<Object>} - Ответ сервера с JWT токеном
 */
export const loginUser = async (credentials) => {
	try {
		const response = await fetch(`${baseUrl}/api/auth/local`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(credentials),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.error?.message || 'Ошибка при входе в систему')
		}

		// Сохраняем токен и данные пользователя в localStorage
		if (data.jwt) {
			localStorage.setItem('token', data.jwt)
			localStorage.setItem('user', JSON.stringify(data.user))
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
 * Функция для проверки авторизации пользователя
 * @returns {Object|null} - Объект с данными пользователя или null, если пользователь не авторизован
 */
export const getCurrentUser = () => {
	if (typeof window === 'undefined') {
		return null
	}

	const token = localStorage.getItem('token')
	const user = localStorage.getItem('user')

	if (!token || !user) {
		return null
	}

	try {
		return JSON.parse(user)
	} catch (error) {
		console.error('Ошибка при получении данных пользователя:', error)
		return null
	}
}

/**
 * Функция для запроса восстановления пароля
 * @param {string} email - Email пользователя
 * @returns {Promise<Object>} - Ответ сервера
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
 * @param {Object} passwordData - Данные для сброса пароля
 * @returns {Promise<Object>} - Ответ сервера
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

/**
 * Функция для обновления данных пользователя
 * @param {number} userId - ID пользователя
 * @param {Object} userData - Новые данные пользователя
 * @returns {Promise<Object>} - Обновленные данные пользователя
 */
export const updateUserProfile = async (userId, userData) => {
	try {
		const token = localStorage.getItem('token')

		if (!token) {
			throw new Error('Пользователь не авторизован')
		}

		const response = await fetch(`${baseUrl}/api/users/${userId}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(userData),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.error?.message || 'Ошибка при обновлении профиля')
		}

		// Обновляем данные пользователя в localStorage
		localStorage.setItem('user', JSON.stringify(data))

		return data
	} catch (error) {
		console.error('Ошибка при обновлении профиля:', error)
		throw error
	}
}

/**
 * Функция проверки валидности токена
 * @returns {Promise<boolean>} - true, если токен валиден, false в противном случае
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
