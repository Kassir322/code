'use client'

import { Provider } from 'react-redux'
import { useRef } from 'react'
import { makeStore } from '@/store'
import { initCart } from '@/store/slices/cartSlice'
import { initWishlist } from '@/store/slices/wishlistSlice'
import { initSettings } from '@/store/slices/appSettingsSlice'

/**
 * Провайдер Redux для Next.js App Router
 * Создает новый экземпляр хранилища для каждого запроса
 * Это предотвращает проблемы с ISR и обновлением цен товаров
 */
export default function StoreProvider({ children }) {
	// Используем useRef для хранения экземпляра стора между рендерами
	const storeRef = useRef(null)

	// Создаем хранилище только если оно еще не существует
	if (!storeRef.current) {
		storeRef.current = makeStore()

		// Инициализируем данные для нового хранилища
		storeRef.current.dispatch(initCart())
		storeRef.current.dispatch(initWishlist())
		storeRef.current.dispatch(initSettings())
	}

	return <Provider store={storeRef.current}>{children}</Provider>
}
