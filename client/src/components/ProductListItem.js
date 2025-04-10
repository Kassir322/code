// src/components/ProductListItem.js (обновленная версия с поддержкой slug)
'use client'

import React, { useState } from 'react'
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

export default function ProductListItem({ product }) {
	const {
		id,
		name,
		price,
		oldPrice,
		rating,
		reviewCount,
		imageSrc,
		label,
		quantity = 5,
		subject,
		grade,
		cardType,
		description = 'Учебные карточки для эффективного изучения и закрепления материала',
		slug, // Используем slug для ссылок
	} = product

	const [wished, setWished] = useState(false)
	const [isAddingToCart, setIsAddingToCart] = useState(false)
	const [isQuickBuying, setIsQuickBuying] = useState(false)

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
		setIsAddingToCart(true)

		// Здесь должна быть логика добавления в корзину через API
		setTimeout(() => {
			setIsAddingToCart(false)
		}, 1000)
	}

	const handleQuickBuy = (e) => {
		e.preventDefault()
		setIsQuickBuying(true)

		// Здесь должна быть логика быстрой покупки
		setTimeout(() => {
			setIsQuickBuying(false)
		}, 1000)
	}

	const handleWishToggle = (e) => {
		e.preventDefault()
		setWished(!wished)

		// Здесь должна быть логика добавления/удаления из закладок
	}

	// Используем slug для URL вместо id
	const productUrl = `/product/${slug || id}`

	return (
		<div className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow w-full mb-4">
			<div className="flex flex-col sm:flex-row">
				{/* Левая часть с изображением */}
				<div className="sm:w-1/4 relative">
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
						className={`absolute top-2 left-2 z-10 m-1 p-2 rounded-full cursor-pointer hover:scale-105 transition-all ${
							!wished && 'hover:bg-red-100'
						} ${wished ? 'bg-red-100' : 'bg-white bg-opacity-80'}`}
						aria-label={wished ? 'Удалить из закладок' : 'Добавить в закладки'}
						onClick={handleWishToggle}
					>
						<Heart
							strokeWidth={2}
							fill={`${wished ? '#ff1212' : 'none'}`}
							color={`${wished ? '#ff1212' : '#666'}`}
							className="h-5 w-5"
						/>
					</button>

					<Link
						href={productUrl}
						className="block h-full bg-neutral-03 border-r-2 border-neutral-200"
					>
						<div className="h-48 sm:h-full relative">
							<Image
								src={'/images/products/card_example2.png'}
								alt={name}
								fill
								className="object-contain group-hover:scale-105 transition-transform duration-300"
							/>
						</div>
					</Link>
				</div>

				{/* Правая часть с информацией */}
				<div className="sm:w-3/4 p-4">
					<Link href={productUrl} className="block">
						<h3 className="text-xl font-medium text-gray-900 hover:text-primary transition-colors mb-2">
							{name}
						</h3>
					</Link>

					{/* Характеристики товара */}
					<div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mb-3">
						<div>
							<span className="text-gray-500">Предмет:</span> {subject}
						</div>
						<div>
							<span className="text-gray-500">Класс:</span> {grade}
						</div>
						<div>
							<span className="text-gray-500">Тип:</span> {cardType}
						</div>
					</div>

					{/* Описание */}
					<p className="text-gray-600 mb-3 line-clamp-2">{description}</p>

					{/* Рейтинг */}
					<div className="mb-3">{renderRating(rating)}</div>

					{/* Нижняя часть с ценой и кнопками */}
					<div className="flex flex-wrap items-center justify-between mt-auto">
						<div className="flex items-center gap-2 mb-2 sm:mb-0">
							{/* Цена */}
							<div className="text-xl font-bold">
								{price} ₽
								{oldPrice && (
									<span className="ml-2 text-sm text-gray-500 line-through">
										{oldPrice} ₽
									</span>
								)}
							</div>

							{/* Статус наличия */}
							<div
								className={`flex items-center gap-1 text-sm font-medium ${stockStatus.className}`}
							>
								<stockStatus.icon className="h-4 w-4" />
								<span>{stockStatus.label}</span>
							</div>
						</div>

						{/* Кнопки действий */}
						<div className="flex gap-2">
							<button
								onClick={handleAddToCart}
								disabled={!stockStatus.available || isAddingToCart}
								className={`px-4 rounded-md inline-flex items-center justify-center py-2 text-sm font-medium transition-colors cursor-pointer ${
									!stockStatus.available
										? 'bg-gray-300 text-gray-500 cursor-not-allowed'
										: isAddingToCart
										? 'bg-green-600 text-white'
										: 'bg-dark text-white hover:bg-hover'
								}`}
							>
								{isAddingToCart ? (
									<>
										<CheckCircle className="h-4 w-4 mr-1" />
										Добавлено
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
								className={`px-4 rounded-md inline-flex items-center justify-center py-2 text-sm font-medium transition-colors cursor-pointer ${
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
			</div>
		</div>
	)
}
