'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { usePathname } from 'next/navigation'
import MyButton from '../ui/MyButton'

export default function Header() {
	const [categoriesOpen, setCategoriesOpen] = useState(false)
	const [productsOpen, setProductsOpen] = useState(false)
	const [blogOpen, setBlogOpen] = useState(false)
	const [pagesOpen, setPagesOpen] = useState(false)
	const pathname = usePathname()

	return (
		<header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-neutral-01">
			<div className="container mx-auto px-4 py-4 flex items-center justify-between">
				{/* Логотип */}
				<Link href="/" className="flex items-center">
					<div className="mr-2">
						<Image
							src="/images/logo.svg"
							alt="Mat-Focus Logo"
							width={40}
							height={40}
							className="w-10 h-10"
						/>
					</div>
					<span className="text-xl font-bold">MatFocus</span>
				</Link>

				{/* Навигация */}
				<nav className=" md:flex space-x-6">
					<Link
						href="/"
						className={`font-medium hover:text-primary ${
							pathname == '/' && 'text-primary'
						}`}
					>
						Главная
					</Link>

					<Link
						href="/catalog"
						className={`font-medium hover:text-primary ${
							pathname == '/catalog' && 'text-primary'
						}`}
					>
						Каталог
					</Link>

					<Link
						href="/contact"
						className={`font-medium hover:text-primary ${
							pathname == '/contact' && 'text-primary'
						}`}
					>
						Контакты
					</Link>
				</nav>

				{/* Правая часть - Аккаунт, Вишлист, Корзина */}
				<div className="flex items-center space-x-4">
					<div className="flex flex-col items-end">
						<Link href="/account" className="flex items-center text-sm">
							<span className="hidden md:inline text-sm">Аккаунт</span>
						</Link>
						<span className="text-xs text-gray-500">Войти</span>
					</div>

					<div className="flex flex-col items-end">
						<Link href="/wishlist" className="flex items-center">
							<span className="hidden md:inline text-sm ">Желаемое</span>
						</Link>
						<span className="text-xs text-gray-500">3-позиции</span>
					</div>

					<div className="flex flex-col items-end">
						<Link href="/cart" className="flex items-center">
							<span className="hidden md:inline text-sm">Корзина</span>
						</Link>
						<span className="text-xs text-gray-500">4-позиции</span>
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
