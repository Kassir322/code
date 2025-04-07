import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import MyButton from './ui/MyButton'

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
		<div className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-shadow">
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
				className="block aspect-[calc(993/1347)] overflow-hidden shadow-sm"
			>
				<div className="h-full w-full relative overflow-hidden border-b border-gray-300 ">
					<Image
						src="/images/products/card_example.png"
						alt={name}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-300"
					/>
				</div>
			</Link>

			{/* Информация о товаре */}
			<div className="flex flex-col gap-1 pt-4">
				<Link href={`/product/${id}`} className="block">
					<h3 className="h-fit text-xl text-center font-medium text-gray-900 hover:text-primary transition-colors mb-1 line-clamp-2 h-10">
						{name}
					</h3>
				</Link>

				{/* Кнопка добавления в корзину */}
				<MyButton className="w-fit text-xl px-4 mx-auto">В корзину</MyButton>

				<div className="flex flex-col items-center justify-center px-8 py-2 gap-1">
					{/* Цена */}
					<div className="flex items-center gap-1 text-2xl">
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

					{/* Рейтинг */}
					<div className="mb-2">{renderRating(rating)}</div>
				</div>
			</div>
		</div>
	)
}
