// src/lib/cookies.js
import Cookies from 'js-cookie'

/**
 * Безопасная обертка для работы с cookies
 * Включает проверку на доступность window для SSR
 * и настройки безопасности cookies
 */
const cookiesService = {
	// Базовые настройки безопасности для cookies
	options: {
		expires: 30, // 30 дней по умолчанию
		path: '/',
		sameSite: 'strict', // Защита от CSRF-атак
		secure: process.env.NODE_ENV === 'production', // В production требуем HTTPS
	},

	/**
	 * Установка cookie с учетом SSR и безопасности
	 * @param {string} name - имя cookie
	 * @param {string} value - значение cookie
	 * @param {object} options - дополнительные опции
	 */
	set: (name, value, options = {}) => {
		if (typeof window === 'undefined') {
			return // В SSR cookies не устанавливаем
		}

		Cookies.set(name, value, { ...cookiesService.options, ...options })
	},

	/**
	 * Получение cookie с проверкой на SSR
	 * @param {string} name - имя cookie
	 * @returns {string|undefined} значение cookie или undefined
	 */
	get: (name) => {
		if (typeof window === 'undefined') {
			return undefined // В SSR cookies недоступны
		}

		return Cookies.get(name)
	},

	/**
	 * Удаление cookie с проверкой на SSR
	 * @param {string} name - имя cookie
	 * @param {object} options - дополнительные опции
	 */
	remove: (name, options = {}) => {
		if (typeof window === 'undefined') {
			return // В SSR cookies не удаляем
		}

		Cookies.remove(name, { ...cookiesService.options, ...options })
	},

	/**
	 * Установка авторизационного токена
	 * @param {string} token - JWT токен
	 * @param {object} options - дополнительные опции
	 */
	setAuthToken: (token, options = {}) => {
		cookiesService.set('token', token, options)
	},

	/**
	 * Получение авторизационного токена
	 * @returns {string|undefined} токен или undefined
	 */
	getAuthToken: () => {
		return cookiesService.get('token')
	},

	/**
	 * Удаление авторизационного токена
	 */
	removeAuthToken: () => {
		cookiesService.remove('token')
	},

	/**
	 * Проверка наличия токена
	 * @returns {boolean} true если токен существует
	 */
	hasAuthToken: () => {
		return !!cookiesService.getAuthToken()
	},
}

export default cookiesService
