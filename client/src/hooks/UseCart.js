'use client'

import { useDispatch, useSelector } from 'react-redux'
import {
	addToCart,
	removeFromCart,
	updateQuantity,
	clearCart,
	selectCartItems,
	selectCartTotal,
	selectCartItemsCount,
	selectIsInCart,
} from '@/store/slices/cartSlice'
import { useEffect, useState } from 'react'

/**
 * Хук для работы с корзиной, предоставляет все необходимые методы и селекторы
 * @returns {Object} Объект с методами и данными для работы с корзиной
 */
export const useCart = () => {
	const dispatch = useDispatch()
	const cartItems = useSelector(selectCartItems)
	const totalPrice = useSelector(selectCartTotal)
	const itemsCount = useSelector(selectCartItemsCount)
	const [isInitialized, setIsInitialized] = useState(false)

	// Метод проверки наличия товара в корзине через селектор
	const isProductInCart = (productId) => {
		return useSelector((state) => selectIsInCart(state, productId))
	}

	// Функции для работы с корзиной
	const addProduct = (product, quantity = 1) => {
		dispatch(addToCart({ ...product, quantity }))
	}

	const removeProduct = (productId) => {
		dispatch(removeFromCart(productId))
	}

	const changeQuantity = (productId, quantity) => {
		dispatch(updateQuantity({ productId, quantity }))
	}

	const emptyCart = () => {
		dispatch(clearCart())
	}

	// Хук для анимации, используется при добавлении товаров в корзину
	const useCartItemAnimation = (productId) => {
		const isInCart = isProductInCart(productId)
		const [animate, setAnimate] = useState(false)
		const [wasInCart, setWasInCart] = useState(isInCart)

		useEffect(() => {
			// Если товар только что добавили в корзину
			if (isInCart && !wasInCart) {
				setAnimate(true)
				setWasInCart(true)

				// Сбрасываем анимацию через 500мс
				const timer = setTimeout(() => {
					setAnimate(false)
				}, 500)

				return () => clearTimeout(timer)
			}

			// Обновляем состояние, если товар был удален
			if (!isInCart && wasInCart) {
				setWasInCart(false)
			}
		}, [isInCart, wasInCart])

		return { animate, isInCart }
	}

	return {
		cartItems,
		totalPrice,
		itemsCount,
		isInitialized,
		addProduct,
		removeProduct,
		changeQuantity,
		emptyCart,
		isProductInCart,
		useCartItemAnimation,
	}
}
