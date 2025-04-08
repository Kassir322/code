'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
	Star,
	Heart,
	ShoppingCart,
	Zap,
	AlertCircle,
	CheckCircle,
	Clock,
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '@/store/slices/cartSlice'
import { selectIsInCart } from '@/store/slices/cartSlice'
import {
	toggleWishlistItem,
	selectIsInWishlist,
} from '@/store/slices/wishlistSlice'
import { useRouter } from 'next/navigation'
import CartNotification from './ui/CartNotification'

export default function ProductCard({ product, variant = 'default' }) {
	const {
		id,
		name,
		price,
		oldPrice,
		rating,
		reviewCount,
		imageSrc,
		label,
		quantity = 5, // По умолчанию считаем, что есть 5 штук в наличии
	} = product

	const [isAddingToCart, setIsAddingToCart] = useState(false)
	const [isQuickBuying, setIsQuickBuying] = useState(false)
	const [showNotification, setShowNotification] = useState(false)
	const [wishlistAnimation, setWishlistAnimation] = useState(false)
	const router = useRouter()

	// Используем Redux
	const dispatch = useDispatch()
	const productInCart = useSelector((state) => selectIsInCart(state, id))
	const isInWishlist = useSelector((state) => selectIsInWishlist(state, id))

	// Эффект для анимации при изменении статуса избранного
	useEffect(() => {
		if (wishlistAnimation) {
			const timer = setTimeout(() => {
				setWishlistAnimation(false)
			}, 500)

			return () => clearTimeout(timer)
		}
	}, [wishlistAnimation])

	// Определяем статус наличия товара
	const getStockStatus = (quantity) => {
		if (quantity <= 0)
			return {
				label: 'Нет в наличии',
				className: 'text-red-500',
				icon: AlertCircle,
				available: false,
			}
		if (quantity < 3)
			return {
				label: 'Скоро закончится',
				className: 'text-orange-500',
				icon: Clock,
				available: true,
			}
		return {
			label: 'В наличии',
			className: 'text-green-500',
			icon: CheckCircle,
			available: true,
		}
	}

	const stockStatus = getStockStatus(quantity)

	// Функция для отображения рейтинга в виде звездочек
	const renderRating = (rating) => {
		return (
			<div className="flex items-center">
				{[...Array(5)].map((_, i) => (
					<Star
						key={i}
						className={`w-4 h-4 ${
							i < Math.floor(rating)
								? 'fill-yellow-400 text-yellow-400'
								: i < rating
								? 'fill-yellow-400 text-yellow-400 opacity-70'
								: 'text-gray-300'
						}`}
					/>
				))}
				<span className="ml-1 text-sm text-gray-600">
					{rating} ({reviewCount})
				</span>
			</div>
		)
	}

	// Обработчики событий для кнопок
	const handleAddToCart = (e) => {
		e.preventDefault()

		if (!stockStatus.available) return

		// Если товар уже в корзине, переходим к корзине
		if (productInCart) {
			router.push('/cart')
			return
		}

		setIsAddingToCart(true)

		// Добавляем товар в корзину через Redux
		dispatch(addToCart(product))

		// Показываем уведомление о добавлении
		setShowNotification(true)

		// Показываем подтверждение добавления на короткое время
		setTimeout(() => {
			setIsAddingToCart(false)
		}, 1000)
	}

	const handleQuickBuy = (e) => {
		e.preventDefault()
		setIsQuickBuying(true)

		// Если товар не в корзине, добавляем его
		if (!productInCart) {
			dispatch(addToCart(product))
		}

		// Переходим к оформлению заказа
		setTimeout(() => {
			setIsQuickBuying(false)
			router.push('/cart/checkout')
		}, 800)
	}

	const handleWishToggle = (e) => {
		e.preventDefault()

		// Запускаем анимацию
		setWishlistAnimation(true)

		// Переключаем товар в списке избранного
		dispatch(toggleWishlistItem({ product }))
	}

	// Закрытие уведомления
	const handleCloseNotification = () => {
		setShowNotification(false)
	}

	return (
		<>
			<div className="mx-auto group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-shadow flex flex-col aspect-[calc(993/1347)] max-h-[570px] min-h-[390px] max-w-[420px] w-full">
				{/* Лейбл (если есть) */}
				{label && (
					<div
						className={`absolute top-2 right-2 z-10 px-2 py-1 text-xs font-semibold rounded-md ${
							label === 'Новинка'
								? 'bg-primary text-white'
								: label.includes('Скидка')
								? 'bg-red-500 text-white'
								: 'bg-yellow-500 text-white'
						}`}
					>
						{label}
					</div>
				)}

				{/* Кнопка добавления в закладки */}
				<button
					className={`absolute top-2 left-2 z-10 m-1 p-2 rounded-full cursor-pointer transition-all ${
						wishlistAnimation ? 'scale-125' : 'hover:scale-105'
					} ${!isInWishlist && 'hover:bg-red-100'} ${
						isInWishlist ? 'bg-red-100' : 'bg-white bg-opacity-80'
					}`}
					aria-label={
						isInWishlist ? 'Удалить из закладок' : 'Добавить в закладки'
					}
					onClick={handleWishToggle}
					title={
						isInWishlist ? 'Удалить из избранного' : 'Добавить в избранное'
					}
				>
					<Heart
						strokeWidth={2}
						fill={`${isInWishlist ? '#ff1212' : 'none'}`}
						color={`${isInWishlist ? '#ff1212' : '#666'}`}
						className={`h-5 w-5 ${wishlistAnimation ? 'animate-pulse' : ''}`}
					/>
				</button>

				{/* Изображение товара */}
				<div className="h-full flex">
					<Link
						href={`/product/${id}`}
						className="flex h-full w-full overflow-hidden items-stretch bg-neutral-03 border-r-2 border-neutral-200 shadow-sm"
					>
						<div className="h-full w-full relative overflow-hidden">
							<Image
								src={'/images/products/card_example2.png'}
								alt={name}
								fill
								className="object-contain group-hover:scale-105 transition-transform duration-300"
							/>
						</div>
					</Link>
				</div>

				{/* Информация о товаре */}
				<div className="flex flex-col gap-1 pt-4 mx-1">
					<Link href={`/product/${id}`} className="block">
						<h3
							className={`${
								variant == 'catalog' ? 'text-lg' : 'text-xl'
							} mx-auto text-center font-medium text-gray-900 hover:text-primary transition-colors mb-1 line-clamp-2 h-14 w-fit max-w-[290px]`}
						>
							{name}
						</h3>
					</Link>

					{/* Цена и информация о наличии */}
					<div className="flex flex-col items-center justify-center px-2 py-2 gap-1">
						{/* Цена */}
						<div
							className={`${
								variant == 'catalog' ? 'text-base' : 'text-2xl'
							} flex items-center gap-1`}
						>
							{oldPrice ? (
								<>
									<span className="font-bold text-gray-900">{price} ₽</span>
									<span className="ml-2 text-sm text-gray-500 line-through">
										{oldPrice} ₽
									</span>
								</>
							) : (
								<span className="font-bold text-gray-900">{price} ₽</span>
							)}
						</div>

						{/* Статус наличия */}
						<div
							className={`flex items-center gap-1 text-sm font-medium ${stockStatus.className}`}
						>
							<stockStatus.icon className="h-4 w-4" />
							<span>{stockStatus.label}</span>
						</div>

						{/* Рейтинг */}
						<div className="mb-2">{renderRating(rating)}</div>
					</div>

					{/* Кнопки действий */}
					<div className="flex justify-center gap-2 mt-2 xl:flex-row flex-col mb-4">
						<button
							onClick={handleAddToCart}
							disabled={!stockStatus.available || isAddingToCart}
							className={`cursor-pointer w-fit mx-auto ${
								variant == 'catalog' ? 'text-sm' : 'text-base'
							} px-4 rounded-md inline-flex items-center justify-center py-2 text-center font-medium transition-colors ${
								!stockStatus.available
									? 'bg-gray-300 text-gray-500 cursor-not-allowed'
									: isAddingToCart
									? 'bg-green-600 text-white'
									: productInCart
									? 'bg-secondary-blue text-white'
									: 'bg-dark text-white hover:bg-hover'
							}`}
							title={productInCart ? 'Перейти в корзину' : 'Добавить в корзину'}
						>
							{isAddingToCart ? (
								<>
									<CheckCircle className="h-4 w-4 mr-1" />
									Добавлено
								</>
							) : productInCart ? (
								<>
									<CheckCircle className="h-4 w-4 mr-1" />В корзине
								</>
							) : (
								<>
									<ShoppingCart className="h-4 w-4 mr-1" />В корзину
								</>
							)}
						</button>

						<button
							onClick={handleQuickBuy}
							disabled={!stockStatus.available || isQuickBuying}
							className={`cursor-pointer w-fit mx-auto ${
								variant == 'catalog' ? 'text-sm' : 'text-base'
							} px-4 rounded-md inline-flex items-center justify-center py-2 text-center font-medium transition-colors ${
								!stockStatus.available
									? 'bg-gray-300 text-gray-500 cursor-not-allowed'
									: isQuickBuying
									? 'bg-green-600 text-white'
									: 'bg-secondary-blue text-white hover:bg-blue-700'
							}`}
						>
							{isQuickBuying ? (
								<>
									<CheckCircle className="h-4 w-4 mr-1" />
									Оформляется...
								</>
							) : (
								<>
									<Zap className="h-4 w-4 mr-1" />
									Купить сейчас
								</>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Уведомление о добавлении в корзину */}
			{showNotification && (
				<CartNotification
					show={showNotification}
					product={product}
					onClose={handleCloseNotification}
				/>
			)}
		</>
	)
}
