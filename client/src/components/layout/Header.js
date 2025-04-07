'use client'

import Link from 'next/link'
import Image from 'next/image'
import NavLink from '../ui/NavLink'

export default function Header() {
	return (
		<header className="fixed top-0 z-50 w-full border-b border-gray-300 bg-neutral-01 px-2 sm:px-4 py-4">
			<div className="lg:container mx-auto  flex items-center justify-between">
				{/* Логотип */}
				<Link href="/" className="flex items-center">
					<div className="hidden sm:inline mr-2">
						<Image
							src="/images/logo.svg"
							alt="Mat-Focus Logo"
							width={40}
							height={40}
							className="w-10 h-10"
						/>
					</div>
					<span className="text-base sm:text-2xl font-bold hover:text-hover transition-colors">
						MatFocus
					</span>
				</Link>

				{/* Навигация */}
				<nav className="flex lg:space-x-15 md:space-x-8 sm:space-x-4 space-x-2">
					<NavLink href="/">Главная</NavLink>
					<NavLink href="/catalog">Каталог</NavLink>
					<NavLink href="/contact">Контакты</NavLink>
				</nav>

				{/* Правая часть - Аккаунт, Вишлист, Корзина */}
				<div className="hidden md:flex items-center space-x-4 ">
					<div className="flex flex-col items-end">
						<Link href="/account" className="flex items-center text-sm">
							<span className="hidden md:inline text-base hover:text-hover transition-colors">
								Аккаунт
							</span>
						</Link>
						<span className="hidden md:inline text-sm text-neutral-04">
							Войти
						</span>
					</div>

					<div className="flex flex-col items-end">
						<Link href="/wishlist" className="flex items-center">
							<span className="hidden md:inline text-base hover:text-hover transition-colors">
								Желаемое
							</span>
						</Link>
						<span className="hidden md:inline text-sm text-gray-500">
							3-позиции
						</span>
					</div>

					<div className="flex flex-col items-end">
						<Link href="/cart" className="flex items-center">
							<span className="hidden md:inline text-base hover:text-hover transition-colors">
								Корзина
							</span>
						</Link>
						<span className="hidden md:inline text-sm text-gray-500">
							4-позиции
						</span>
					</div>
				</div>

				{/* Мобильное меню (кнопка бургер) */}
				<button className="md:hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
		</header>
	)
}
