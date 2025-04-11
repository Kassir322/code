import Cookies from 'js-cookie'
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

		// Если в ответе есть jwt, значит пользователь автоматически авторизован после регистрации
		if (data.jwt) {
			// Сохраняем данные пользователя в localStorage
			localStorage.setItem('user', JSON.stringify(data.user))

			// Сохраняем токен в cookies
			Cookies.set('token', data.jwt, { expires: 30, path: '/' })
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
			body: JSON.stringify(credentials),
		})

		const data = await response.json()

		if (!response.ok) {
			throw new Error(data.error?.message || 'Ошибка при входе в систему')
		}

		// Сохраняем данные пользователя в localStorage
		localStorage.setItem('user', JSON.stringify(data.user))

		// Сохраняем токен в cookies
		Cookies.set('token', data.jwt, { expires: 30, path: '/' })

		return data
	} catch (error) {
		console.error('Ошибка при входе:', error)
		throw error
	}
}

// Обновите функцию logoutUser
export const logoutUser = () => {
	// Удаляем данные пользователя из localStorage
	localStorage.removeItem('user')

	// Удаляем токен из cookies
	Cookies.remove('token', { path: '/' })
}

// Обновите функцию validateToken
export const validateToken = async () => {
	try {
		// Получаем токен из cookies
		const token = Cookies.get('token')

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

// Обновите функцию getCurrentUser
export const getCurrentUser = () => {
	try {
		// Проверяем наличие токена в cookies
		const token = Cookies.get('token')
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
