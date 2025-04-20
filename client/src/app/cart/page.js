'use client'

import { useSelector, useDispatch } from 'react-redux'
import { selectCartItems, clearCart } from '@/store/slices/cartSlice'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { useEffect } from 'react'
import { initCart } from '@/store/slices/cartSlice'

export default function CartPage() {
	const cartItems = useSelector(selectCartItems)
	const dispatch = useDispatch()

	// Обеспечиваем инициализацию корзины
	useEffect(() => {
		dispatch(initCart())
	}, [dispatch])

	const handleClearCart = () => {
		if (confirm('Вы действительно хотите очистить корзину?')) {
			dispatch(clearCart())
		}
	}

	// Настройка хлебных крошек
	const breadcrumbItems = [
		{ name: 'Главная', url: '/' },
		{ name: 'Корзина', url: '/cart' },
	]

	return (
		<div className="container mx-auto px-4 mt-24 mb-16">
			{/* Хлебные крошки */}
			<Breadcrumbs items={breadcrumbItems} />

			<h1 className="text-3xl font-bold mb-8">Корзина</h1>

			{cartItems.length > 0 ? (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Список товаров в корзине */}
					<div className="lg:col-span-2">
						<div className="bg-white rounded-lg shadow-sm p-6">
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-xl font-semibold">Ваши товары</h2>
								<button
									onClick={handleClearCart}
									className="flex items-center text-red-500 hover:text-red-700 transition-colors"
									aria-label="Очистить корзину"
								>
									<Trash2 className="h-4 w-4 mr-1" />
									<span className="text-sm">Очистить</span>
								</button>
							</div>

							<div className="divide-y divide-gray-200">
								{cartItems.map((item) => (
									<CartItem key={item.id} item={item} />
								))}
							</div>
						</div>

						<div className="mt-6">
							<Link
								href="/catalog/all"
								className="flex items-center text-secondary-blue hover:underline"
							>
								<ArrowLeft className="h-4 w-4 mr-1" />
								<span>Продолжить покупки</span>
							</Link>
						</div>
					</div>

					{/* Сводка заказа */}
					<div className="lg:col-span-1">
						<CartSummary />
					</div>
				</div>
			) : (
				<div className="bg-white rounded-lg shadow-sm p-8 text-center">
					<div className="flex flex-col items-center">
						<ShoppingCart className="h-20 w-20 text-gray-300 mb-4" />
						<h2 className="text-2xl font-semibold mb-2">Ваша корзина пуста</h2>
						<p className="text-gray-600 mb-6">
							Похоже, вы еще не добавили товары в корзину.
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
