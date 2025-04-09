import { createSlice } from '@reduxjs/toolkit'

// Функция для загрузки избранных товаров из localStorage на клиенте
const loadWishlistFromStorage = () => {
	if (typeof window !== 'undefined') {
		try {
			const storedWishlist = localStorage.getItem('wishlist')
			return storedWishlist ? JSON.parse(storedWishlist) : []
		} catch (error) {
			console.error(
				'Ошибка при загрузке избранных товаров из localStorage:',
				error
			)
			return []
		}
	}
	return []
}

const initialState = {
	items: [],
	isLoading: true,
}

export const wishlistSlice = createSlice({
	name: 'wishlist',
	initialState,
	reducers: {
		// Инициализация избранных товаров из localStorage
		initWishlist: (state) => {
			state.items = loadWishlistFromStorage()
			state.isLoading = false
		},

		// Добавление товара в избранное
		addToWishlist: (state, action) => {
			const product = action.payload

			// Проверяем, существует ли товар уже в избранном
			const existingItemIndex = state.items.findIndex(
				(item) => item.id === product.id
			)

			// Добавляем только если его еще нет
			if (existingItemIndex === -1) {
				state.items.push(product)

				// Сохраняем в localStorage
				if (typeof window !== 'undefined') {
					localStorage.setItem('wishlist', JSON.stringify(state.items))
				}
			}
		},

		// Удаление товара из избранного
		removeFromWishlist: (state, action) => {
			const productId = action.payload
			state.items = state.items.filter((item) => item.id !== productId)

			// Сохраняем в localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('wishlist', JSON.stringify(state.items))
			}
		},

		// Переключатель статуса (добавляет, если нет, и удаляет, если уже есть)
		toggleWishlistItem: (state, action) => {
			const { product, productId } = action.payload
			const id = productId || (product ? product.id : null)

			if (!id) return

			const existingItemIndex = state.items.findIndex((item) => item.id === id)

			if (existingItemIndex !== -1) {
				// Если товар уже есть, удаляем его
				state.items = state.items.filter((item) => item.id !== id)
			} else {
				// Если товара еще нет, добавляем его
				if (product) {
					// Проверяем, что у нас есть объект товара
					state.items.push(product)
				}
			}

			// Сохраняем в localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('wishlist', JSON.stringify(state.items))
			}
		},

		// Очистка избранного
		clearWishlist: (state) => {
			state.items = []

			// Сохраняем в localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('wishlist', JSON.stringify(state.items))
			}
		},
	},
})

// Экспортируем actions
export const {
	initWishlist,
	addToWishlist,
	removeFromWishlist,
	toggleWishlistItem,
	clearWishlist,
} = wishlistSlice.actions

// Селекторы
export const selectWishlistItems = (state) => state.wishlist.items
export const selectWishlistIsLoading = (state) => state.wishlist.isLoading
export const selectWishlistItemsCount = (state) => state.wishlist.items.length
export const selectIsInWishlist = (state, productId) =>
	state.wishlist.items.some((item) => item.id === productId)

export default wishlistSlice.reducer
