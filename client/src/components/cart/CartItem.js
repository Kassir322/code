'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, X } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity } from '@/store/slices/cartSlice'

export default function CartItem({ item }) {
	const dispatch = useDispatch()

	const handleQuantityChange = (newQty) => {
		dispatch(updateQuantity({ productId: item.id, quantity: newQty }))
	}

	const handleRemove = () => {
		dispatch(removeFromCart(item.id))
	}

	return (
		<div className="flex flex-col sm:flex-row justify-between items-center py-4 border-b border-gray-200">
			{/* Изображение и название */}
			<div className="flex flex-row items-center flex-grow mb-4 sm:mb-0">
				<div className="relative h-24 w-24 rounded bg-neutral-03">
					<Link href={`/product/${item.id}`}>
						<Image
							src="/images/products/card_example2.png"
							alt={item.title}
							fill
							className="object-contain p-2"
						/>
					</Link>
				</div>

				<div className="ml-4 flex-grow">
					<Link href={`/product/${item.id}`}>
						<h3 className="font-medium text-lg hover:text-secondary-blue transition-colors">
							{item.name}
						</h3>
					</Link>

					{item.cardType && item.grade && (
						<p className="text-gray-600 text-sm">
							{item.cardType} | {item.grade}
						</p>
					)}
				</div>
			</div>

			{/* Управление количеством */}
			<div className="flex items-center justify-between sm:justify-end w-full sm:w-auto sm:space-x-10">
				{/* Количество */}
				<div className="flex items-center space-x-2">
					<button
						onClick={() => handleQuantityChange(item.quantity - 1)}
						className="p-1 rounded border border-gray-300 hover:bg-gray-100"
						aria-label="Уменьшить количество"
					>
						<Minus className="h-4 w-4" />
					</button>

					<span className="w-10 text-center">{item.quantity}</span>

					<button
						onClick={() => handleQuantityChange(item.quantity + 1)}
						className="p-1 rounded border border-gray-300 hover:bg-gray-100"
						aria-label="Увеличить количество"
					>
						<Plus className="h-4 w-4" />
					</button>
				</div>

				{/* Цена */}
				<div className="flex flex-col items-end min-w-[100px]">
					<div className="font-semibold">{item.price * item.quantity} ₽</div>
					{item.oldPrice && (
						<div className="text-sm text-gray-500 line-through">
							{item.oldPrice * item.quantity} ₽
						</div>
					)}
				</div>

				{/* Удалить */}
				<button
					onClick={handleRemove}
					className="ml-4 p-1 text-gray-500 hover:text-red-500 transition-colors"
					aria-label="Удалить товар"
				>
					<X className="h-5 w-5" />
				</button>
			</div>
		</div>
	)
}
