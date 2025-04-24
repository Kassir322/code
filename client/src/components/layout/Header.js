'use client'

import Link from 'next/link'
import Image from 'next/image'
import NavLink from '../ui/NavLink'
import CartIcon from '../ui/CartIcon'
import WishlistIcon from '../ui/WishlistIcon'
import { Menu, User, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCartItemsCount, selectCartItems } from '@/store/slices/cartSlice'
import {
	selectWishlistItemsCount,
	selectWishlistItems,
} from '@/store/slices/wishlistSlice'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [cartItemCount, setCartItemCount] = useState(0)
	const [cartAnimation, setCartAnimation] = useState(false)

	// Используем Redux для получения количества товаров
	const itemsCount = useSelector(selectCartItemsCount)
	const wishlistItemsCount = useSelector(selectWishlistItemsCount)
	const cartItems = useSelector(selectCartItems)
	const wishlistItems = useSelector(selectWishlistItems)

	// Получаем данные о пользователе
	const { user, isAuthenticated, logout } = useAuth()
	console.log(`user ${user}, isAuthenticated ${isAuthenticated}`)

	// При изменении количества товаров запускаем анимацию корзины
	useEffect(() => {
		if (cartItemCount !== 0 && cartItemCount !== itemsCount) {
			setCartAnimation(true)

			// Сбрасываем анимацию через 300мс
			const timer = setTimeout(() => {
				setCartAnimation(false)
			}, 300)

			return () => clearTimeout(timer)
		}

		setCartItemCount(itemsCount)
	}, [itemsCount, cartItemCount])

	return (
		<header className="fixed top-0 z-50 w-full border-b border-gray-300 bg-neutral-01 px-2 sm:px-4 py-4">
			<div className="lg:container mx-auto flex items-center justify-between">
				{/* Логотип */}
				<Link href="/" className="flex items-center group">
					<div className="inline mr-2">
						<Image
							src="/images/logo.svg"
							alt="Mat-Focus Logo"
							width={40}
							height={40}
							className="w-10 h-10 group-hover:rotate-x-25 group-hover:rotate-z-15 transform-3d transition-all duration-700"
						/>
					</div>
					<span className="text-lg sm:text-xl font-bold group-hover:text-hover transition-colors">
						MatFocus
					</span>
				</Link>

				{/* Навигация */}
				<nav className="hidden md:flex lg:space-x-15 md:space-x-6 sm:space-x-4 space-x-2">
					<NavLink href="/">Главная</NavLink>
					<NavLink href="/catalog/all">Каталог</NavLink>
					<NavLink href="/contact">Контакты</NavLink>
					<NavLink href="/about">О компании</NavLink>
				</nav>

				{/* Правая часть - Аккаунт, Вишлист, Корзина */}
				<div className="hidden md:flex items-center space-x-6">
					{/* Желаемое */}
					<div className="flex flex-col items-end">
						<Link href="/wishlist" className="flex items-center">
							<WishlistIcon />
							<span className="hidden xl:inline ml-2 text-base hover:text-hover transition-colors">
								Избранное
							</span>
						</Link>
					</div>

					{/* Корзина */}
					<div className="flex flex-col items-end">
						<Link href="/cart" className="flex items-center relative">
							<CartIcon />
							<span className="hidden xl:inline ml-2 text-base hover:text-hover transition-colors">
								Корзина
								{cartItems.length > 0 && (
									<span className="ml-1 text-secondary-blue font-medium">
										{cartItems.reduce(
											(total, item) => total + item.price * item.quantity,
											0
										)}{' '}
										₽
									</span>
								)}
							</span>
						</Link>
					</div>

					{/* Аккаунт */}
					<div className="flex flex-col items-end">
						{isAuthenticated && user ? (
							<Link href="/account" className="flex items-center group">
								<div className="w-8 h-8 rounded-full bg-secondary-blue overflow-hidden flex items-center justify-center text-white">
									{user.avatar ? (
										<img
											src={user.avatar}
											alt={user.username}
											className="w-full h-full object-cover"
										/>
									) : (
										<span className="text-sm font-medium">
											{user.username.charAt(0).toUpperCase()}
										</span>
									)}
								</div>
								<div className="hidden min-[900px]:block ml-2">
									<p className="text-sm font-medium truncate max-w-[120px] group-hover:text-hover transition-colors">
										{user.username}
									</p>
									<p className="text-xs text-gray-500 truncate max-w-[120px]">
										{user.email}
									</p>
								</div>
							</Link>
						) : (
							<Link href="/account" className="flex items-center text-sm">
								<User className="h-5 w-5 mr-1 md:mr-2" />
								<span className="hidden min-[900px]:inline text-base hover:text-hover transition-colors">
									Аккаунт
								</span>
							</Link>
						)}
					</div>
				</div>

				{/* Мобильные иконки */}
				<div className="flex md:hidden items-center space-x-4">
					{/* Избранное на мобильном */}
					<Link href="/wishlist" className="flex items-center">
						<WishlistIcon />
					</Link>

					{/* Корзина на мобильном */}
					<Link href="/cart" className="flex items-center">
						<CartIcon />
					</Link>

					{/* Аккаунт на мобильном */}
					<Link href="/account" className="flex items-center">
						{isAuthenticated && user ? (
							<div className="w-7 h-7 rounded-full bg-secondary-blue overflow-hidden flex items-center justify-center text-white">
								{user.avatar ? (
									<img
										src={user.avatar}
										alt={user.username}
										className="w-full h-full object-cover"
									/>
								) : (
									<span className="text-xs font-medium">
										{user.username.charAt(0).toUpperCase()}
									</span>
								)}
							</div>
						) : (
							<User className="h-5 w-5" />
						)}
					</Link>

					{/* Мобильное меню (кнопка бургер) */}
					<button
						className="p-1"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label="Открыть меню"
					>
						<Menu className="w-6 h-6" />
					</button>
				</div>
			</div>

			{/* Мобильное меню */}
			{isMenuOpen && (
				<div className="md:hidden bg-white border-t border-gray-200 absolute left-0 right-0 z-50">
					<nav className="container mx-auto py-4 px-4 flex flex-col space-y-3">
						<Link
							href="/"
							className="py-2 hover:text-secondary-blue"
							onClick={() => setIsMenuOpen(false)}
						>
							Главная
						</Link>
						<Link
							href="/catalog/all"
							className="py-2 hover:text-secondary-blue"
							onClick={() => setIsMenuOpen(false)}
						>
							Каталог
						</Link>
						<Link
							href="/contact"
							className="py-2 hover:text-secondary-blue"
							onClick={() => setIsMenuOpen(false)}
						>
							Контакты
						</Link>
						<Link
							href="/account"
							className="py-2 hover:text-secondary-blue"
							onClick={() => setIsMenuOpen(false)}
						>
							<User className="h-4 w-4 inline mr-2" />
							{isAuthenticated && user ? user.username : 'Аккаунт'}
						</Link>
						<Link
							href="/wishlist"
							className="py-2 hover:text-secondary-blue"
							onClick={() => setIsMenuOpen(false)}
						>
							<Heart className="h-4 w-4 inline mr-2" />
							Избранное
							{wishlistItemsCount > 0 && (
								<span className="ml-1 text-red-500 font-medium">
									({wishlistItemsCount})
								</span>
							)}
						</Link>

						{/* Информация о корзине в мобильном меню */}
						<div className="pt-2 border-t border-gray-100 mt-2">
							{itemsCount > 0 ? (
								<div>
									<p className="text-sm text-gray-600">
										В корзине {itemsCount} товаров на сумму:
									</p>
									<p className="font-semibold text-secondary-blue">
										{cartItems.reduce(
											(total, item) => total + item.price * item.quantity,
											0
										)}{' '}
										₽
									</p>
								</div>
							) : (
								<p className="text-sm text-gray-600">Ваша корзина пуста</p>
							)}
						</div>

						{/* Информация об избранном в мобильном меню */}
						{wishlistItemsCount > 0 && (
							<div className="pt-2 border-t border-gray-100 mt-2">
								<p className="text-sm text-gray-600">
									В избранном: {wishlistItemsCount} товаров
								</p>
							</div>
						)}
					</nav>
				</div>
			)}
		</header>
	)
}
