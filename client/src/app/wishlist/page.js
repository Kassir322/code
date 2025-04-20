'use client'

import { useSelector, useDispatch } from 'react-redux'
import {
	selectWishlistItems,
	clearWishlist,
	removeFromWishlist,
} from '@/store/slices/wishlistSlice'
import { ArrowLeft, Heart, Trash2, ShoppingCart, Bell } from 'lucide-react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { useEffect } from 'react'
import { initWishlist } from '@/store/slices/wishlistSlice'
import ProductCard from '@/components/ProductCard'

export default function WishlistPage() {
	const wishlistItems = useSelector(selectWishlistItems)
	const dispatch = useDispatch()

	// Обеспечиваем инициализацию избранного
	useEffect(() => {
		dispatch(initWishlist())
	}, [dispatch])

	const handleClearWishlist = () => {
		if (confirm('Вы действительно хотите очистить избранное?')) {
			dispatch(clearWishlist())
		}
	}

	// Настройка хлебных крошек
	const breadcrumbItems = [
		{ name: 'Главная', url: '/' },
		{ name: 'Избранное', url: '/wishlist' },
	]

	return (
		<div className="container mx-auto px-4 mt-24 mb-16">
			{/* Хлебные крошки */}
			<Breadcrumbs items={breadcrumbItems} />

			<h1 className="text-3xl font-bold mb-8">Избранное</h1>

			{wishlistItems.length > 0 ? (
				<div>
					<div className="mb-6">
						<Link
							href="/catalog/all"
							className="flex items-center text-secondary-blue hover:underline"
						>
							<ArrowLeft className="h-4 w-4 mr-1" />
							<span>В каталог</span>
						</Link>
					</div>

					{/* Блок с приглашением настроить оповещения */}
					<div className="bg-blue-50 rounded-lg p-6 mb-8">
						<div className="flex items-start gap-4">
							<div className="bg-secondary-blue rounded-full p-3">
								<Bell className="h-6 w-6 text-white" />
							</div>
							<div>
								<h3 className="text-lg font-semibold mb-2">
									Хотите быть в курсе наличия товаров?
								</h3>
								<p className="text-gray-600 mb-4">
									Настройте уведомления в личном кабинете, и мы сообщим вам,
									когда желаемые товары появятся в наличии.
								</p>
								<Link
									href="/profile/notifications"
									className="inline-flex items-center text-secondary-blue hover:underline"
								>
									Настроить уведомления
									<ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
								</Link>
							</div>
						</div>
					</div>

					{/* Заголовок с кнопкой очистки */}
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-xl font-semibold">
							Ваши избранные товары ({wishlistItems.length})
						</h2>
						<button
							onClick={handleClearWishlist}
							className="flex items-center text-red-500 hover:text-red-700 transition-colors"
							aria-label="Очистить избранное"
						>
							<Trash2 className="h-4 w-4 mr-1" />
							<span className="text-sm">Очистить список</span>
						</button>
					</div>

					{/* Список избранных товаров */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{wishlistItems.map((item) => (
							<ProductCard key={item.id} product={item} variant="catalog" />
						))}
					</div>
				</div>
			) : (
				<div className="bg-white rounded-lg shadow-sm p-8 text-center">
					<div className="flex flex-col items-center">
						<Heart className="h-20 w-20 text-gray-300 mb-4" />
						<h2 className="text-2xl font-semibold mb-2">
							В избранном пока ничего нет
						</h2>
						<p className="text-gray-600 mb-6">
							Добавляйте понравившиеся товары в избранное, чтобы вернуться к ним
							позже.
						</p>
						<Link
							href="/catalog/all"
							className="bg-secondary-blue text-white rounded-md py-3 px-6 hover:bg-blue-700 transition-colors"
						>
							Перейти в каталог
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}
