import { createSlice } from '@reduxjs/toolkit'

// Функция для загрузки настроек из localStorage на клиенте
const loadSettingsFromStorage = () => {
	if (typeof window !== 'undefined') {
		try {
			const storedSettings = localStorage.getItem('appSettings')
			return storedSettings ? JSON.parse(storedSettings) : {}
		} catch (error) {
			console.error('Ошибка при загрузке настроек из localStorage:', error)
			return {}
		}
	}
	return {}
}

const initialState = {
	theme: 'light', // 'light' или 'dark'
	notifications: {
		addToCart: true, // Показывать уведомления при добавлении в корзину
		orderStatus: true, // Показывать уведомления о статусе заказа
	},
	lastViewedProducts: [], // ID последних просмотренных товаров
	...loadSettingsFromStorage(), // Загружаем сохраненные настройки при инициализации
}

export const appSettingsSlice = createSlice({
	name: 'appSettings',
	initialState,
	reducers: {
		// Инициализация настроек из localStorage
		initSettings: (state) => {
			const storedSettings = loadSettingsFromStorage()
			return {
				...state,
				...storedSettings,
			}
		},

		// Изменение темы оформления
		toggleTheme: (state) => {
			state.theme = state.theme === 'light' ? 'dark' : 'light'

			// Сохраняем в localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('appSettings', JSON.stringify(state))
			}
		},

		// Настройка уведомлений
		toggleNotificationSetting: (state, action) => {
			const { notificationType } = action.payload
			if (state.notifications[notificationType] !== undefined) {
				state.notifications[notificationType] =
					!state.notifications[notificationType]

				// Сохраняем в localStorage
				if (typeof window !== 'undefined') {
					localStorage.setItem('appSettings', JSON.stringify(state))
				}
			}
		},

		// Добавление товара в список недавно просмотренных
		addToLastViewed: (state, action) => {
			const productId = action.payload

			// Удаляем продукт, если он уже есть в списке
			state.lastViewedProducts = state.lastViewedProducts.filter(
				(id) => id !== productId
			)

			// Добавляем в начало списка
			state.lastViewedProducts.unshift(productId)

			// Ограничиваем список до 10 товаров
			state.lastViewedProducts = state.lastViewedProducts.slice(0, 10)

			// Сохраняем в localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('appSettings', JSON.stringify(state))
			}
		},

		// Очистка списка недавно просмотренных товаров
		clearLastViewed: (state) => {
			state.lastViewedProducts = []

			// Сохраняем в localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('appSettings', JSON.stringify(state))
			}
		},

		// Полный сброс настроек до значений по умолчанию
		resetSettings: () => {
			// Также удаляем сохраненные настройки из localStorage
			if (typeof window !== 'undefined') {
				localStorage.removeItem('appSettings')
			}

			return initialState
		},
	},
})

// Экспортируем actions
export const {
	initSettings,
	toggleTheme,
	toggleNotificationSetting,
	addToLastViewed,
	clearLastViewed,
	resetSettings,
} = appSettingsSlice.actions

// Селекторы
export const selectTheme = (state) => state.appSettings.theme
export const selectNotificationSettings = (state) =>
	state.appSettings.notifications
export const selectLastViewedProducts = (state) =>
	state.appSettings.lastViewedProducts
export const selectIsNotificationEnabled = (state, type) =>
	state.appSettings.notifications[type] !== undefined
		? state.appSettings.notifications[type]
		: true

export default appSettingsSlice.reducer
