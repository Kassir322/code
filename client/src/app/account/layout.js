// src/app/account/layout.js
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function AccountLayout({ children }) {
	// Все страницы внутри директории /account, кроме /account/login и /account/register, будут защищены
	// Проверяем, является ли текущий маршрут исключением
	const isAuthPage = (pathname) => {
		return (
			pathname.includes('/login') ||
			pathname.includes('/register') ||
			pathname.includes('/forgot-password')
		)
	}

	// Если текущий маршрут - страница авторизации, не используем ProtectedRoute
	if (typeof window !== 'undefined' && isAuthPage(window.location.pathname)) {
		return children
	}

	// Для остальных страниц используем ProtectedRoute
	return <ProtectedRoute>{children}</ProtectedRoute>
}
