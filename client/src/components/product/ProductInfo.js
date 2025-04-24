'use client'
// src/components/product/ProductInfo.js
import { Star, AlertCircle, CheckCircle, Clock, Info } from 'lucide-react'

export default function ProductInfo({ product }) {
	const {
		title,
		price,
		oldPrice,
		rating = 4.5,
		reviewCount = 0,
		category,
		cardType,
		quantity = 5,
		numberOfCards,
		grades,
	} = product
	// Определение статуса наличия товара
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

	// Рендер рейтинга в виде звезд
	const renderRating = (rating) => {
		return (
			<div className="flex items-center">
				{[...Array(5)].map((_, i) => (
					<Star
						key={i}
						className={`w-5 h-5 ${
							i < Math.floor(rating)
								? 'fill-yellow-400 text-yellow-400'
								: i < rating
								? 'fill-yellow-400 text-yellow-400 opacity-70'
								: 'text-gray-300'
						}`}
					/>
				))}
				<span className="ml-2 text-gray-600 text-lg">
					{rating.toFixed(1)} {reviewCount > 0 && `(${reviewCount})`}
				</span>
			</div>
		)
	}

	return (
		<>
			{/* Название товара */}
			<h1 className="text-3xl font-bold mb-2">{title}</h1>

			{/* Рейтинг */}
			<div className="mb-4">{renderRating(rating)}</div>

			{/* Цена */}
			<div className="flex items-center mb-4">
				<span className="text-3xl font-bold mr-3">{price} ₽</span>
				{oldPrice && (
					<span className="text-xl text-gray-500 line-through">
						{oldPrice} ₽
					</span>
				)}
			</div>

			{/* Характеристики товара */}
			<div className="grid grid-cols-2 md:gap-4 gap-2 mb-6">
				<div className="flex items-center">
					<span className="text-gray-500 mr-2">Предмет:</span>
					<span className="font-medium">{category?.name || 'Не указан'}</span>
				</div>

				<div className="flex items-center">
					<span className="text-gray-500 mr-2">Класс:</span>
					{grades.length > 0 ? (
						grades.map((grade, i) => (
							<span
								key={i}
								className="font-medium text-white bg-secondary-blue rounded-md m-0.5 p-1 px-2"
							>
								{grade.displayName || 'Не указан'}
							</span>
						))
					) : (
						<span className="font-medium text-gray-500">Не указан</span>
					)}
				</div>

				<div className="flex items-center">
					<span className="text-gray-500 mr-2">Тип:</span>
					<span className="font-medium">{cardType || 'Не указан'}</span>
				</div>

				<div className="flex items-center">
					<span className="text-gray-500 mr-2">Количество карточек:</span>
					<span className="font-medium">{numberOfCards || 'Не указано'}</span>
				</div>
			</div>

			{/* Статус товара */}
			<div
				className={`flex items-center gap-2 mb-6 text-lg font-medium ${stockStatus.className}`}
			>
				<stockStatus.icon className="h-5 w-5" />
				<span>{stockStatus.label}</span>
			</div>

			{/* Уведомление, если товар не доступен */}
			{quantity <= 0 && (
				<div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
					<div className="flex">
						<AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
						<div>
							<h3 className="text-sm font-medium text-red-800">
								Товар временно отсутствует
							</h3>
							<p className="text-sm text-red-700 mt-1">
								Вы можете подписаться на уведомление о поступлении этого товара.
							</p>
							<button className="mt-2 text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
								Уведомить о поступлении
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Информация о доставке */}
			<div className="bg-blue-50 p-4 rounded-md mb-4">
				<div className="flex items-start">
					<Info className="h-5 w-5 text-secondary-blue mt-0.5 mr-2 flex-shrink-0" />
					<div>
						<h3 className="font-medium text-secondary-blue">Доставка:</h3>
						<p className="text-gray-600 text-sm mt-1">
							Доступна доставка по всей России. СДЭК, Почта России, 5post,
							Boxberry. Стоимость доставки рассчитывается при оформлении заказа.
						</p>
					</div>
				</div>
			</div>
		</>
	)
}
