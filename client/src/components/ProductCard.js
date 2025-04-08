'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, ShoppingCart, Zap } from 'lucide-react'
import MyButton from './ui/MyButton'

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

	const getStockStatus = (quantity) => {
		if (quantity <= 0)
			return { label: 'Нет в наличии', className: 'text-red-500' }
		if (quantity < 3)
			return { label: 'Скоро закончится', className: 'text-orange-500' }
		if (quantity < 10)
			return { label: 'В наличии', className: 'text-green-500' }
		return { label: 'В наличии', className: 'text-green-500' }
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
								? 'fill-yellow-400 text-yellow-400 fill-half'
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

	const [wished, setWished] = useState(false)

	return (
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
				className={`absolute top-2 left-2 z-10 m-1 p-2 rounded-full    cursor-pointer hover:scale-120 transition-all ${
					!wished && 'hover:bg-red-300'
				} `}
				aria-label="Добавить в закладки"
				onClick={(e) => {
					e.preventDefault()
					setWished(!wished)
					// Логика добавления в закладки
				}}
			>
				<Heart
					strokeWidth={3}
					fill={`${wished ? '#ff1212' : '#fff'}`}
					color={`${wished ? '#ff1212' : '#000'}`}
					className="h-5 w-5 text-gray-600 m-auto"
				/>
			</button>

			{/* Изображение товара */}
			<div className="h-full flex">
				<Link
					href={`/product/${id}`}
					className="flex h-full w-full overflow-hidden items-stretch"
				>
					<div className="h-full w-full relative overflow-hidden">
						<Image
							src="/images/products/card_example2.png"
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

				{/* Кнопки действий */}
				<div className="flex justify-center gap-2 mt-2 xl:flex-row flex-col">
					<MyButton
						className={`w-fit mx-auto ${
							variant == 'catalog' ? 'text-sm' : 'text-base'
						} px-4`}
					>
						<ShoppingCart className="h-4 w-4 mr-1" />В корзину
					</MyButton>

					<MyButton
						className={`w-fit mx-auto ${
							variant == 'catalog' ? 'text-sm' : 'text-base'
						} px-4 bg-secondary-blue`}
					>
						<Zap className="h-4 w-4 mr-1" />
						Купить сейчас
					</MyButton>
				</div>

				<div className="flex flex-col items-center justify-center px-2 py-2 gap-1">
					{/* Цена */}
					<div
						className={`${
							variant == 'catalog' ? 'text-base' : 'text-2xl'
						} flex items-center gap-1 text-2xl`}
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
						{/* Статус наличия */}
						<p
							className={`ml-4 text-center text-sm font-medium ${stockStatus.className}`}
						>
							{stockStatus.label}
						</p>
					</div>

					{/* Рейтинг */}
					<div className="mb-2">{renderRating(rating)}</div>
				</div>
			</div>
		</div>
	)
}
