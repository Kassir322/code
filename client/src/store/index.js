import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import cartReducer from './slices/cartSlice'
import wishlistReducer from './slices/wishlistSlice'
import appSettingsReducer from './slices/appSettingsSlice'
import authReducer from './slices/authSlice'
import { api } from './api'

// Вместо глобального хранилища создаем функцию, которая будет создавать хранилище для каждого запроса
export function makeStore() {
	return configureStore({
		reducer: {
			cart: cartReducer,
			wishlist: wishlistReducer,
			appSettings: appSettingsReducer,
			auth: authReducer,
			[api.reducerPath]: api.reducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(api.middleware),
		// Включаем Redux DevTools для удобной отладки
		devTools: process.env.NODE_ENV !== 'production',
	})
}

// Глобальное хранилище для поддержки обратной совместимости
// Это позволит избежать ошибок при рефакторинге
export const store = makeStore()

// Настройка слушателей для RTK Query
setupListeners(store.dispatch)
