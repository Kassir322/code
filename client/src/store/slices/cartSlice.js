import { createSlice } from '@reduxjs/toolkit'

// Функция для загрузки данных из localStorage на клиенте
const loadCartFromStorage = () => {
	if (typeof window !== 'undefined') {
		try {
			const storedCart = localStorage.getItem('cart')
			return storedCart ? JSON.parse(storedCart) : []
		} catch (error) {
			console.error('Ошибка при загрузке корзины из localStorage:', error)
			return []
		}
	}
	return []
}

const initialState = {
	items: [],
	isLoading: true,
}

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		// Инициализация корзины из localStorage
		initCart: (state) => {
			state.items = loadCartFromStorage()
			state.isLoading = false
		},

		// Добавление товара в корзину
		addToCart: (state, action) => {
			const product = action.payload
			const existingItemIndex = state.items.findIndex(
				(item) => item.id === product.id
			)

			if (existingItemIndex !== -1) {
				// Если товар уже есть, увеличиваем количество на указанное в payload
				// Важно! Учитываем quantity из payload, а не просто +1
				state.items[existingItemIndex].quantity += product.quantity || 1
			} else {
				// Если товара нет, добавляем его с количеством из payload
				// Убеждаемся, что quantity установлено (по умолчанию 1)
				const quantityToAdd = product.quantity || 1
				state.items.push({ ...product, quantity: quantityToAdd })
			}

			// Сохраняем в localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('cart', JSON.stringify(state.items))
			}
		},

		// Удаление товара из корзины
		removeFromCart: (state, action) => {
			const productId = action.payload
			state.items = state.items.filter((item) => item.id !== productId)

			// Сохраняем в localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('cart', JSON.stringify(state.items))
			}
		},

		// Изменение количества товара
		updateQuantity: (state, action) => {
			const { productId, quantity } = action.payload

			if (quantity <= 0) {
				// Если количество <= 0, удаляем товар
				state.items = state.items.filter((item) => item.id !== productId)
			} else {
				// Иначе обновляем количество
				const existingItem = state.items.find((item) => item.id === productId)
				if (existingItem) {
					existingItem.quantity = quantity
				}
			}

			// Сохраняем в localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('cart', JSON.stringify(state.items))
			}
		},

		// Очистка корзины
		clearCart: (state) => {
			state.items = []

			// Сохраняем в localStorage
			if (typeof window !== 'undefined') {
				localStorage.setItem('cart', JSON.stringify(state.items))
			}
		},
	},
})

// Экспортируем actions
export const {
	initCart,
	addToCart,
	removeFromCart,
	updateQuantity,
	clearCart,
} = cartSlice.actions

// Селекторы
export const selectCartItems = (state) => state.cart.items
export const selectCartIsLoading = (state) => state.cart.isLoading
export const selectCartItemsCount = (state) =>
	state.cart.items.reduce((count, item) => count + item.quantity, 0)
export const selectCartTotal = (state) =>
	state.cart.items.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	)
export const selectIsInCart = (state, productId) =>
	state.cart.items.some((item) => item.id === productId)

export default cartSlice.reducer
