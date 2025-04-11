'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector, useDispatch } from 'react-redux'
import {
	selectIsAuthenticated,
	selectIsLoading,
	fetchCurrentUser,
} from '@/store/slices/authSlice'

/**
 * Компонент для защиты маршрутов, требующих авторизации
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Дочерние элементы
 * @returns {React.ReactNode} - Защищенный контент или перенаправление на страницу входа
 */
export default function ProtectedRoute({ children }) {
	const isAuthenticated = useSelector(selectIsAuthenticated)
	const isLoading = useSelector(selectIsLoading)
	const [isChecking, setIsChecking] = useState(true)
	const router = useRouter()
	const dispatch = useDispatch()

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = localStorage.getItem('token')

				if (!token) {
					// Если токена нет, перенаправляем на страницу входа
					setIsChecking(false)
					return
				}

				// Проверяем валидность токена
				const response = await fetch(
					`${
						process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'
					}/api/users/me`,
					{
						method: 'GET',
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				)

				if (!response.ok) {
					// Если токен не валиден, очищаем localStorage
					localStorage.removeItem('token')
					localStorage.removeItem('user')
					setIsAuthenticated(false)
				} else {
					// Если токен валиден, устанавливаем флаг аутентификации
					setIsAuthenticated(true)
				}
			} catch (error) {
				console.error('Ошибка при проверке авторизации:', error)
				setIsAuthenticated(false)
			} finally {
				setIsChecking(false)
			}
		}

		checkAuth()
	}, [])

	useEffect(() => {
		// Если проверка завершена и пользователь не авторизован, перенаправляем на страницу входа
		if (!isChecking && !isLoading && !isAuthenticated) {
			router.push(
				'/account/login?redirect=' +
					encodeURIComponent(window.location.pathname)
			)
		}
	}, [isChecking, isAuthenticated, isLoading, router])

	// Показываем индикатор загрузки, пока проверяется авторизация
	if (isChecking || isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-blue"></div>
			</div>
		)
	}

	// Если пользователь авторизован, отображаем защищенный контент
	return isAuthenticated ? children : null
}
