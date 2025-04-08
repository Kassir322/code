'use client'

import { useSelector, useDispatch } from 'react-redux'
import {
	selectWishlistItems,
	clearWishlist,
	removeFromWishlist,
} from '@/store/slices/wishlistSlice'
import { addToCart } from '@/store/slices/cartSlice'
import { ArrowLeft, Heart, Trash2, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { useEffect, useState } from 'react'
import { initWishlist } from '@/store/slices/wishlistSlice'
import Image from 'next/image'
import { selectIsInCart } from '@/store/slices/cartSlice'

export default function WishlistPage() {
	const wishlistItems = useSelector(selectWishlistItems)
	const dispatch = useDispatch()
	const [itemsBeingAdded, setItemsBeingAdded] = useState({})

	// Обеспечиваем инициализацию избранного
	useEffect(() => {
		dispatch(initWishlist())
	}, [dispatch])

	const handleClearWishlist = () => {
		if (confirm('Вы действительно хотите очистить избранное?')) {
			dispatch(clearWishlist())
		}
	}

	const handleRemoveFromWishlist = (id) => {
		dispatch(removeFromWishlist(id))
	}

	const handleAddToCart = (product) => {
		// Отмечаем, что товар добавляется в корзину
		setItemsBeingAdded((prev) => ({ ...prev, [product.id]: true }))

		// Добавляем товар в корзину
		dispatch(addToCart(product))

		// Сбрасываем статус добавления через 1 секунду
		setTimeout(() => {
			setItemsBeingAdded((prev) => ({ ...prev, [product.id]: false }))
		}, 1000)
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
							<WishlistCard
								key={item.id}
								product={item}
								onRemove={() => handleRemoveFromWishlist(item.id)}
								onAddToCart={() => handleAddToCart(item)}
								isAddingToCart={itemsBeingAdded[item.id]}
							/>
						))}
					</div>

					<div className="mt-6">
						<Link
							href="/catalog"
							className="flex items-center text-secondary-blue hover:underline"
						>
							<ArrowLeft className="h-4 w-4 mr-1" />
							<span>В каталог</span>
						</Link>
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
							href="/catalog"
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

// Компонент карточки товара в избранном
function WishlistCard({ product, onRemove, onAddToCart, isAddingToCart }) {
	const isInCart = useSelector((state) => selectIsInCart(state, product.id))

	return (
		<div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
			<div className="relative">
				{/* Действия над карточкой */}
				<button
					onClick={onRemove}
					className="absolute top-2 right-2 z-10 p-2 bg-white bg-opacity-80 rounded-full hover:bg-red-100 transition-colors"
					aria-label="Удалить из избранного"
				>
					<Trash2 className="h-4 w-4 text-red-500" />
				</button>

				{/* Изображение товара */}
				<Link href={`/product/${product.id}`}>
					<div className="h-48 bg-neutral-03 relative">
						<Image
							src="/images/products/card_example2.png"
							alt={product.name}
							fill
							className="object-contain p-4"
						/>
					</div>
				</Link>
			</div>

			{/* Информация о товаре */}
			<div className="p-4">
				<Link href={`/product/${product.id}`}>
					<h3 className="font-medium text-lg line-clamp-2 hover:text-secondary-blue transition-colors h-14">
						{product.name}
					</h3>
				</Link>

				{/* Цена */}
				<div className="mt-2 mb-4">
					<div className="flex items-center gap-2">
						<span className="font-bold text-lg">{product.price} ₽</span>
						{product.oldPrice && (
							<span className="text-sm text-gray-500 line-through">
								{product.oldPrice} ₽
							</span>
						)}
					</div>
				</div>

				{/* Кнопка добавления в корзину */}
				<button
					onClick={onAddToCart}
					disabled={isAddingToCart}
					className={`w-full py-2 px-4 rounded-md font-medium text-white transition-colors ${
						isAddingToCart
							? 'bg-green-600'
							: isInCart
							? 'bg-secondary-blue'
							: 'bg-dark hover:bg-hover'
					}`}
				>
					{isAddingToCart ? (
						'Добавлено'
					) : isInCart ? (
						<span className="flex items-center justify-center">
							<ShoppingCart className="h-4 w-4 mr-1" />В корзине
						</span>
					) : (
						<span className="flex items-center justify-center">
							<ShoppingCart className="h-4 w-4 mr-1" />В корзину
						</span>
					)}
				</button>
			</div>
		</div>
	)
}
