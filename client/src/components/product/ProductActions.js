'use client'
// src/components/product/ProductActions.js
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { addToCart, selectIsInCart } from '@/store/slices/cartSlice'
import {
	toggleWishlistItem,
	selectIsInWishlist,
} from '@/store/slices/wishlistSlice'
import { addToLastViewed } from '@/store/slices/appSettingsSlice'
import { useRouter } from 'next/navigation'
import {
	Heart,
	ShoppingCart,
	Zap,
	CheckCircle,
	Plus,
	Minus,
} from 'lucide-react'
import CartNotification from '@/components/ui/CartNotification'
import WishlistNotification from '@/components/ui/WishlistNotification'

export default function ProductActions({ product }) {
	const {
		id,
		quantity = 5, // По умолчанию считаем, что есть 5 штук в наличии
	} = product

	// Состояния UI
	const [productQuantity, setProductQuantity] = useState(1)
	const [isAddingToCart, setIsAddingToCart] = useState(false)
	const [isQuickBuying, setIsQuickBuying] = useState(false)
	const [showCartNotification, setShowCartNotification] = useState(false)
	const [showWishlistNotification, setShowWishlistNotification] =
		useState(false)
	const [isWishlistActionAdd, setIsWishlistActionAdd] = useState(true)
	const [wishlistAnimation, setWishlistAnimation] = useState(false)

	const router = useRouter()
	const dispatch = useAppDispatch()

	// Селекторы Redux для проверки наличия товара в корзине и избранном
	const productInCart = useAppSelector((state) => selectIsInCart(state, id))
	const isInWishlist = useAppSelector((state) => selectIsInWishlist(state, id))

	// Определяем, доступен ли товар
	const isAvailable = quantity > 0

	// Добавляем товар в список просмотренных при загрузке страницы
	useEffect(() => {
		dispatch(addToLastViewed(id))
	}, [id, dispatch])

	// Обработчик анимации для избранного
	useEffect(() => {
		if (wishlistAnimation) {
			const timer = setTimeout(() => {
				setWishlistAnimation(false)
			}, 500)

			return () => clearTimeout(timer)
		}
	}, [wishlistAnimation])

	// Управление количеством товара
	const increaseQuantity = () => {
		setProductQuantity((prev) => prev + 1)
	}

	const decreaseQuantity = () => {
		if (productQuantity > 1) {
			setProductQuantity((prev) => prev - 1)
		}
	}

	// Обработчики действий с корзиной и избранным
	const handleAddToCart = () => {
		if (!isAvailable) return

		// Если товар уже в корзине, переходим к корзине
		if (productInCart) {
			router.push('/cart')
			return
		}

		setIsAddingToCart(true)

		// Создаем копию объекта товара и устанавливаем в нее выбранное количество
		const productToAdd = {
			...product,
			quantity: productQuantity, // Это важно - используем productQuantity вместо значения по умолчанию
		}

		// Добавляем товар в корзину через Redux с указанным количеством
		dispatch(addToCart(productToAdd))

		// Показываем уведомление о добавлении
		setShowCartNotification(true)

		// Показываем подтверждение добавления на короткое время
		setTimeout(() => {
			setIsAddingToCart(false)
		}, 1000)
	}

	const handleQuickBuy = () => {
		if (!isAvailable) return

		setIsQuickBuying(true)

		// Если товар не в корзине, добавляем его
		if (!productInCart) {
			// Создаем копию объекта товара и устанавливаем в нее выбранное количество
			const productToAdd = {
				...product,
				quantity: productQuantity, // Используем выбранное пользователем количество
			}
			dispatch(addToCart(productToAdd))
		}

		// Переходим к оформлению заказа
		setTimeout(() => {
			setIsQuickBuying(false)
			router.push('/cart/checkout')
		}, 800)
	}

	const handleWishToggle = () => {
		// Запускаем анимацию
		setWishlistAnimation(true)

		// Определяем, добавляем или удаляем из избранного
		setIsWishlistActionAdd(!isInWishlist)

		// Переключаем товар в списке избранного
		dispatch(toggleWishlistItem({ product }))

		// Показываем уведомление
		setShowWishlistNotification(true)
	}

	// Обработчики закрытия уведомлений
	const handleCloseCartNotification = () => {
		setShowCartNotification(false)
	}

	const handleCloseWishlistNotification = () => {
		setShowWishlistNotification(false)
	}

	return (
		<>
			{/* Выбор количества */}
			<div className="flex items-center mb-6">
				<span className="text-gray-700 mr-4">Количество:</span>
				<div className="flex items-center border border-gray-300 rounded-md">
					<button
						onClick={decreaseQuantity}
						disabled={productQuantity <= 1}
						className={`cursor-pointer p-2 ${
							productQuantity <= 1
								? 'text-gray-300'
								: 'text-gray-600 hover:bg-gray-100'
						}`}
						aria-label="Уменьшить количество"
					>
						<Minus className="h-5 w-5" />
					</button>

					<span className="w-12 text-center text-lg">{productQuantity}</span>

					<button
						onClick={increaseQuantity}
						className="cursor-pointer p-2 text-gray-600 hover:bg-gray-100"
						aria-label="Увеличить количество"
					>
						<Plus className="h-5 w-5" />
					</button>
				</div>
			</div>

			{/* Кнопки действий */}
			<div className="flex flex-col sm:flex-row gap-4 mb-6">
				<button
					onClick={handleAddToCart}
					disabled={!isAvailable || isAddingToCart}
					className={`cursor-pointer flex-1 py-3 px-4 rounded-md text-lg font-medium flex items-center justify-center transition-colors ${
						!isAvailable
							? 'bg-gray-300 text-gray-500 cursor-not-allowed'
							: isAddingToCart
							? 'bg-green-600 text-white'
							: productInCart
							? 'bg-secondary-blue text-white hover:bg-blue-700'
							: 'bg-dark text-white hover:bg-hover'
					}`}
					aria-label={
						productInCart ? 'Перейти в корзину' : 'Добавить в корзину'
					}
				>
					{isAddingToCart ? (
						<>
							<CheckCircle className="h-5 w-5 mr-2" />
							Добавлено
						</>
					) : productInCart ? (
						<>
							<ShoppingCart className="h-5 w-5 mr-2" />В корзине
						</>
					) : (
						<>
							<ShoppingCart className="h-5 w-5 mr-2" />В корзину
						</>
					)}
				</button>

				<button
					onClick={handleQuickBuy}
					disabled={!isAvailable || isQuickBuying}
					className={`cursor-pointer flex-1 py-3 px-4 rounded-md text-lg font-medium flex items-center justify-center transition-colors ${
						!isAvailable
							? 'bg-gray-300 text-gray-500 cursor-not-allowed'
							: isQuickBuying
							? 'bg-green-600 text-white'
							: 'bg-secondary-blue text-white hover:bg-blue-700'
					}`}
					aria-label="Купить сейчас"
				>
					{isQuickBuying ? (
						<>
							<CheckCircle className="h-5 w-5 mr-2" />
							Оформляется...
						</>
					) : (
						<>
							<Zap className="h-5 w-5 mr-2" />
							Купить сейчас
						</>
					)}
				</button>

				<button
					onClick={handleWishToggle}
					className={`cursor-pointer p-3 rounded-md border border-gray-300 transition-colors ${
						isInWishlist ? 'bg-red-50 border-red-300' : 'hover:bg-gray-100'
					}`}
					aria-label={
						isInWishlist ? 'Удалить из избранного' : 'Добавить в избранное'
					}
				>
					<Heart
						className={`h-6 w-6 ${
							isInWishlist ? 'text-red-500' : 'text-gray-600'
						}`}
						fill={isInWishlist ? '#ef4444' : 'none'}
					/>
				</button>
			</div>

			{/* Уведомления */}
			{showCartNotification && (
				<CartNotification
					show={showCartNotification}
					product={product}
					onClose={handleCloseCartNotification}
				/>
			)}

			{showWishlistNotification && (
				<WishlistNotification
					show={showWishlistNotification}
					product={product}
					isAdded={isWishlistActionAdd}
					onClose={handleCloseWishlistNotification}
				/>
			)}
		</>
	)
}
