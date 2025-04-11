// src/components/auth/ProtectedRoute.js (обновленная версия)
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Компонент для защиты маршрутов, требующих авторизации
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние элементы
 * @returns {React.ReactNode} - Защищенный контент или перенаправление на страницу входа
 */
export default function ProtectedRoute({ children }) {
	const [isChecking, setIsChecking] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const router = useRouter()

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = localStorage.getItem('token')

				if (!token) {
					// Если токена нет, перенаправляем на страницу входа
					router.push(
						`/account/login?redirect=${encodeURIComponent(
							window.location.pathname
						)}`
					)
					return
				}

				// Проверяем валидность токена через API
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
					// Если токен не валиден, удаляем его и перенаправляем на страницу входа
					localStorage.removeItem('token')
					localStorage.removeItem('user')
					router.push(
						`/account/login?redirect=${encodeURIComponent(
							window.location.pathname
						)}`
					)
					return
				}

				// Если токен валиден, устанавливаем флаг аутентификации
				setIsAuthenticated(true)
			} catch (error) {
				console.error('Ошибка при проверке авторизации:', error)

				// В случае ошибки перенаправляем на страницу входа
				router.push(
					`/account/login?redirect=${encodeURIComponent(
						window.location.pathname
					)}`
				)
			} finally {
				setIsChecking(false)
			}
		}

		checkAuth()
	}, [router])

	// Показываем индикатор загрузки, пока проверяется авторизация
	if (isChecking) {
		return (
			<div className="flex justify-center items-center min-h-[50vh]">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-blue"></div>
			</div>
		)
	}

	// Если пользователь авторизован, отображаем защищенный контент
	return isAuthenticated ? children : null
}
