import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import cartReducer from './slices/cartSlice'
import wishlistReducer from './slices/wishlistSlice'
import appSettingsReducer from './slices/appSettingsSlice'
import authReducer from './slices/authSlice'
import { api } from './api'

export const store = configureStore({
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

// Настройка слушателей для RTK Query
setupListeners(store.dispatch)
