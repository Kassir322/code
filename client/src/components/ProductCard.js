import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

export default function ProductCard({ product }) {
	const { id, name, price, oldPrice, rating, reviewCount, imageSrc, label } =
		product

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

	return (
		<div className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
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

			{/* Изображение товара */}
			<Link
				href={`/product/${id}`}
				className="block aspect-square overflow-hidden"
			>
				<div className="h-48 w-full relative overflow-hidden">
					<Image
						src={imageSrc}
						alt={name}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-300"
					/>
				</div>
			</Link>

			{/* Информация о товаре */}
			<div className="p-4">
				<Link href={`/product/${id}`} className="block">
					<h3 className="text-sm font-medium text-gray-900 hover:text-primary transition-colors mb-1 line-clamp-2 h-10">
						{name}
					</h3>
				</Link>

				{/* Рейтинг */}
				<div className="mb-2">{renderRating(rating)}</div>

				{/* Цена */}
				<div className="flex items-center">
					{oldPrice ? (
						<>
							<span className="text-lg font-bold text-gray-900">{price} ₽</span>
							<span className="ml-2 text-sm text-gray-500 line-through">
								{oldPrice} ₽
							</span>
						</>
					) : (
						<span className="text-lg font-bold text-gray-900">{price} ₽</span>
					)}
				</div>

				{/* Кнопка добавления в корзину */}
				<button className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50">
					В корзину
				</button>
			</div>
		</div>
	)
}
