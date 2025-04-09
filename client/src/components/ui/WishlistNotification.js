'use client'
// src/components/ui/WishlistNotification.js
import { useState, useEffect } from 'react'
import { Heart, X } from 'lucide-react'
import Link from 'next/link'

/**
 * Компонент уведомления о добавлении/удалении товара из избранного
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.show - Отображать ли уведомление
 * @param {Object} props.product - Добавленный/удаленный товар
 * @param {boolean} props.isAdded - Добавление (true) или удаление (false)
 * @param {Function} props.onClose - Функция закрытия уведомления
 * @returns {JSX.Element}
 */
export default function WishlistNotification({
	show,
	product,
	isAdded = true,
	onClose,
}) {
	const [isVisible, setIsVisible] = useState(false)
	const [exitAnimation, setExitAnimation] = useState(false)

	// Управление анимацией появления и исчезновения
	useEffect(() => {
		if (show) {
			setIsVisible(true)
			setExitAnimation(false)

			// Автоматически скрываем через 3 секунды
			const timer = setTimeout(() => {
				handleClose()
			}, 3000)

			return () => clearTimeout(timer)
		}
	}, [show])

	// Функция закрытия с анимацией
	const handleClose = () => {
		setExitAnimation(true)

		// Ждем завершения анимации перед полным скрытием
		setTimeout(() => {
			setIsVisible(false)
			onClose && onClose()
		}, 300)
	}

	if (!isVisible || !product) return null

	return (
		<div
			className={`fixed bottom-5 right-5 max-w-sm bg-white shadow-lg rounded-lg overflow-hidden z-50 transition-transform duration-300 ${
				exitAnimation
					? 'transform translate-x-full opacity-0'
					: 'transform translate-x-0 opacity-100'
			}`}
		>
			<div className="flex p-4">
				<div
					className={`${
						isAdded ? 'bg-red-100' : 'bg-gray-100'
					} rounded-full p-2 mr-3`}
				>
					<Heart
						className={`h-5 w-5 ${isAdded ? 'text-red-600' : 'text-gray-600'}`}
						fill={isAdded ? '#dc2626' : 'none'}
					/>
				</div>

				<div className="flex-1">
					<div className="flex justify-between items-start">
						<h3 className="font-medium text-gray-900">
							{isAdded
								? 'Товар добавлен в избранное'
								: 'Товар удален из избранного'}
						</h3>
						<button
							onClick={handleClose}
							className="text-gray-400 hover:text-gray-600 transition-colors"
							aria-label="Закрыть уведомление"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					<p className="text-sm text-gray-600 mt-1 line-clamp-1">
						{product.name || product.title}
					</p>

					{isAdded && (
						<div className="mt-3 flex space-x-3">
							<Link
								href="/wishlist"
								className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 transition-colors"
								onClick={handleClose}
							>
								<Heart className="h-4 w-4 inline-block mr-1" />
								Перейти в избранное
							</Link>

							<button
								onClick={handleClose}
								className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
							>
								Продолжить покупки
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
