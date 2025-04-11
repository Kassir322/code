'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
	User,
	ShoppingBag,
	Heart,
	Settings,
	LogOut,
	AlertCircle,
	Package,
	MapPin,
	CreditCard,
	Bell,
} from 'lucide-react'
import cookiesService from '@/lib/cookies'

export default function AccountPage() {
	const [isLoading, setIsLoading] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [user, setUser] = useState(null)
	const [error, setError] = useState(null)
	const router = useRouter()

	// Проверка авторизации при загрузке компонента
	useEffect(() => {
		const checkAuth = async () => {
			try {
				setIsLoading(true)

				// Получаем токен через cookiesService
				const token = cookiesService.getAuthToken()

				if (!token) {
					router.push('/account/login?redirect=/account')
					return
				}

				const apiUrl = `${
					process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
				}/api/users/me`

				const response = await fetch(apiUrl, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})

				if (!response.ok) {
					// Если токен не валиден, удаляем его
					cookiesService.removeAuthToken()
					localStorage.removeItem('user')
					router.push('/account/login?redirect=/account')
					return
				}

				// Получаем данные пользователя из ответа
				const userData = await response.json()

				// Устанавливаем флаг авторизации и данные пользователя
				setIsAuthenticated(true)
				setUser(userData)
			} catch (error) {
				console.error('Ошибка при проверке авторизации:', error)
				setError(
					'Произошла ошибка при проверке авторизации. Пожалуйста, попробуйте еще раз.'
				)

				// В случае ошибки также перенаправляем на страницу входа
				router.push('/account/login?redirect=/account')
			} finally {
				setIsLoading(false)
			}
		}

		checkAuth()
	}, [router])

	// Функция для выхода из аккаунта
	const handleLogout = () => {
		try {
			// Удаляем данные пользователя из localStorage
			localStorage.removeItem('user')

			// Удаляем токен через cookiesService
			cookiesService.removeAuthToken()

			// Перенаправляем на страницу входа
			router.push('/account/login')
		} catch (error) {
			console.error('Ошибка при выходе из аккаунта:', error)
		}
	}

	// Отображаем загрузку, пока проверяется авторизация
	if (isLoading) {
		return (
			<div className="container mx-auto px-4 mt-24 mb-16 flex justify-center items-center min-h-[50vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-blue"></div>
			</div>
		)
	}

	// Если произошла ошибка, показываем сообщение
	if (error) {
		return (
			<div className="container mx-auto px-4 mt-24 mb-16">
				<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 flex items-start">
					<AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
					<div>
						<p className="font-medium text-red-700">Ошибка</p>
						<p className="text-red-600 mt-1">{error}</p>
					</div>
				</div>
				<div className="text-center">
					<Link
						href="/account/login"
						className="inline-flex items-center justify-center py-3 px-6 bg-secondary-blue text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
					>
						Вернуться на страницу входа
					</Link>
				</div>
			</div>
		)
	}

	// Основной контент личного кабинета для авторизованного пользователя
	return (
		<div className="container mx-auto px-4 mt-24 mb-16">
			{/* Хлебные крошки */}
			<Breadcrumbs
				items={[
					{ name: 'Главная', url: '/' },
					{ name: 'Личный кабинет', url: '/account' },
				]}
			/>

			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold mb-8">Личный кабинет</h1>

				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Боковое меню */}
					<div className="md:col-span-1">
						<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
							<div className="flex items-center space-x-4 mb-6">
								<div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
									{user?.avatar ? (
										<img
											src={user.avatar}
											alt={user.username}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-secondary-blue text-white text-2xl font-bold">
											{user?.username?.charAt(0) || 'U'}
										</div>
									)}
								</div>
								<div>
									<h2 className="font-semibold text-lg">
										{user?.username || 'Пользователь'}
									</h2>
									<p className="text-sm text-gray-600">
										{user?.email || 'email@example.com'}
									</p>
								</div>
							</div>

							<nav className="space-y-1">
								<Link
									href="/account"
									className="flex items-center space-x-3 py-2 px-3 rounded-md bg-primary-light text-primary"
								>
									<User className="h-5 w-5" />
									<span>Обзор</span>
								</Link>
								<Link
									href="/account/orders"
									className="flex items-center space-x-3 py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
								>
									<ShoppingBag className="h-5 w-5" />
									<span>Мои заказы</span>
								</Link>
								<Link
									href="/wishlist"
									className="flex items-center space-x-3 py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
								>
									<Heart className="h-5 w-5" />
									<span>Избранное</span>
								</Link>
								<Link
									href="/account/settings"
									className="flex items-center space-x-3 py-2 px-3 rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
								>
									<Settings className="h-5 w-5" />
									<span>Настройки</span>
								</Link>
								<button
									onClick={handleLogout}
									className="w-full flex items-center space-x-3 py-2 px-3 rounded-md text-red-600 hover:bg-red-50 cursor-pointer"
								>
									<LogOut className="h-5 w-5" />
									<span>Выйти</span>
								</button>
							</nav>
						</div>
					</div>

					{/* Основной контент */}
					<div className="md:col-span-3">
						{/* Последние заказы */}
						<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
							<h2 className="text-xl font-semibold mb-4">Последние заказы</h2>

							<div className="text-center py-8 text-gray-500">
								<Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
								<p>У вас пока нет заказов</p>
								<Link
									href="/catalog"
									className="mt-3 inline-block text-secondary-blue hover:underline"
								>
									Перейти в каталог
								</Link>
							</div>
						</div>

						{/* Виджеты */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
							{/* Адреса доставки */}
							<div className="bg-white rounded-lg shadow-sm p-6">
								<div className="flex justify-between items-start mb-4">
									<h3 className="font-semibold">Адреса доставки</h3>
									<MapPin className="h-5 w-5 text-gray-400" />
								</div>
								<p className="text-sm text-gray-600 mb-3">
									Добавьте адреса для быстрого оформления заказов
								</p>
								<Link
									href="/account/addresses"
									className="text-sm text-secondary-blue hover:underline cursor-pointer"
								>
									Управление адресами
								</Link>
							</div>

							{/* Способы оплаты */}
							<div className="bg-white rounded-lg shadow-sm p-6">
								<div className="flex justify-between items-start mb-4">
									<h3 className="font-semibold">Способы оплаты</h3>
									<CreditCard className="h-5 w-5 text-gray-400" />
								</div>
								<p className="text-sm text-gray-600 mb-3">
									Настройте предпочтительные способы оплаты
								</p>
								<Link
									href="/account/payment-methods"
									className="text-sm text-secondary-blue hover:underline cursor-pointer"
								>
									Управление способами оплаты
								</Link>
							</div>

							{/* Уведомления */}
							<div className="bg-white rounded-lg shadow-sm p-6">
								<div className="flex justify-between items-start mb-4">
									<h3 className="font-semibold">Уведомления</h3>
									<Bell className="h-5 w-5 text-gray-400" />
								</div>
								<p className="text-sm text-gray-600 mb-3">
									Настройте параметры получения уведомлений
								</p>
								<Link
									href="/account/notifications"
									className="text-sm text-secondary-blue hover:underline cursor-pointer"
								>
									Настроить уведомления
								</Link>
							</div>
						</div>

						{/* Недавно просмотренные */}
						<div className="bg-white rounded-lg shadow-sm p-6">
							<h2 className="text-xl font-semibold mb-4">
								Недавно просмотренные
							</h2>

							<div className="text-center py-8 text-gray-500">
								<p>Здесь будут отображаться недавно просмотренные товары</p>
								<Link
									href="/catalog"
									className="mt-3 inline-block text-secondary-blue hover:underline"
								>
									Перейти в каталог
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
