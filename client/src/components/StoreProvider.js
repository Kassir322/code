'use client'

import { Provider } from 'react-redux'
import { store } from '@/store'
import { useEffect } from 'react'
import { initCart } from '@/store/slices/cartSlice'
import { initWishlist } from '@/store/slices/wishlistSlice'
import { initSettings } from '@/store/slices/appSettingsSlice'

export default function StoreProvider({ children }) {
	// Инициализация данных при загрузке приложения
	useEffect(() => {
		// Инициализируем корзину
		store.dispatch(initCart())

		// Инициализируем избранное
		store.dispatch(initWishlist())

		// Инициализируем настройки приложения
		store.dispatch(initSettings())
	}, [])

	return <Provider store={store}>{children}</Provider>
}
