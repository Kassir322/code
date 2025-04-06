'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Header() {
	const [categoriesOpen, setCategoriesOpen] = useState(false)
	const [productsOpen, setProductsOpen] = useState(false)
	const [blogOpen, setBlogOpen] = useState(false)
	const [pagesOpen, setPagesOpen] = useState(false)

	return (
		<header className="w-full border-b border-gray-200">
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
				<nav className="hidden md:flex space-x-6">
					<Link href="/" className="font-medium hover:text-primary">
						Home
					</Link>

					<div className="relative group">
						<button
							className="flex items-center font-medium hover:text-primary"
							onClick={() => setCategoriesOpen(!categoriesOpen)}
						>
							Categories <ChevronDown className="ml-1 h-4 w-4" />
						</button>
						{/* Выпадающее меню для Categories */}
					</div>

					<div className="relative group">
						<button
							className="flex items-center font-medium hover:text-primary"
							onClick={() => setProductsOpen(!productsOpen)}
						>
							Products <ChevronDown className="ml-1 h-4 w-4" />
						</button>
						{/* Выпадающее меню для Products */}
					</div>

					<div className="relative group">
						<button
							className="flex items-center font-medium hover:text-primary"
							onClick={() => setBlogOpen(!blogOpen)}
						>
							Blog <ChevronDown className="ml-1 h-4 w-4" />
						</button>
						{/* Выпадающее меню для Blog */}
					</div>

					<div className="relative group">
						<button
							className="flex items-center font-medium hover:text-primary"
							onClick={() => setPagesOpen(!pagesOpen)}
						>
							Pages <ChevronDown className="ml-1 h-4 w-4" />
						</button>
						{/* Выпадающее меню для Pages */}
					</div>

					<Link href="/offers" className="font-medium hover:text-primary">
						Offers
					</Link>
				</nav>

				{/* Правая часть - Аккаунт, Вишлист, Корзина */}
				<div className="flex items-center space-x-4">
					<div className="flex flex-col items-end">
						<Link href="/account" className="flex items-center text-sm">
							<span className="hidden md:inline text-sm">Account</span>
						</Link>
						<span className="text-xs text-gray-500">LOGIN</span>
					</div>

					<div className="flex flex-col items-end">
						<Link href="/wishlist" className="flex items-center">
							<span className="hidden md:inline text-sm">Wishlist</span>
						</Link>
						<span className="text-xs">3-ITEMS</span>
					</div>

					<div className="flex flex-col items-end">
						<Link href="/cart" className="flex items-center">
							<span className="hidden md:inline text-sm">Cart</span>
						</Link>
						<span className="text-xs">3-ITEMS</span>
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
