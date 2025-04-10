'use client'

import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectCartItems, selectCartTotal } from '@/store/slices/cartSlice'
import Link from 'next/link'

export default function CartSummary() {
	const cartItems = useSelector(selectCartItems)
	const totalPrice = useSelector(selectCartTotal)
	const router = useRouter()

	// Логика для оформления заказа
	const handleCheckout = () => {
		router.push('/cart/checkout')
	}

	// Список доступных способов доставки и оплаты
	const deliveryMethods = [
		{ name: 'СДЭК', price: 300 },
		{ name: 'Почта России', price: 250 },
		{ name: 'Boxberry', price: 280 },
		{ name: '5Post', price: 270 },
	]

	// Находим самый дешевый способ доставки для отображения
	const cheapestDelivery = deliveryMethods.reduce((prev, current) =>
		prev.price < current.price ? prev : current
	)

	// Количество товаров в корзине
	const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)

	return (
		<div className="bg-white p-6 rounded-lg shadow-sm">
			<h2 className="text-xl font-semibold mb-4">Ваш заказ</h2>

			<div className="space-y-3 mb-6">
				<div className="flex justify-between">
					<span className="text-gray-600">Товары ({itemsCount} шт.):</span>
					<span>{totalPrice} ₽</span>
				</div>

				<div className="flex justify-between">
					<span className="text-gray-600">Доставка:</span>
					<span>от {cheapestDelivery.price} ₽</span>
				</div>

				<div className="border-t pt-3 mt-3">
					<div className="flex justify-between font-semibold text-lg">
						<span>Итого:</span>
						<span>{totalPrice} ₽*</span>
					</div>
					<p className="text-xs text-gray-500 mt-1">
						* Без учета доставки. Финальная стоимость будет рассчитана при
						оформлении заказа.
					</p>
				</div>
			</div>

			<button
				onClick={handleCheckout}
				disabled={itemsCount === 0}
				className={`cursor-pointer w-full py-3 px-4 rounded-md font-medium text-center transition-colors ${
					itemsCount === 0
						? 'bg-gray-300 text-gray-500 cursor-not-allowed'
						: 'bg-secondary-blue text-white hover:bg-blue-700'
				}`}
			>
				Оформить заказ
			</button>

			<div className="mt-4">
				<Link
					href="/catalog"
					className="text-secondary-blue hover:underline text-sm"
				>
					Продолжить покупки
				</Link>
			</div>

			<div className="mt-6 space-y-3">
				<h3 className="font-medium">Доступные способы доставки:</h3>
				<ul className="space-y-2 text-sm text-gray-600">
					{deliveryMethods.map((method) => (
						<li key={method.name} className="flex justify-between">
							<span>{method.name}</span>
							<span>{method.price} ₽</span>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
