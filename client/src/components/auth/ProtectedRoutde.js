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
				// Проверяем авторизацию пользователя
				await dispatch(fetchCurrentUser()).unwrap()
			} catch (error) {
				console.error('Ошибка при проверке авторизации:', error)
			} finally {
				setIsChecking(false)
			}
		}

		checkAuth()
	}, [dispatch])

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
