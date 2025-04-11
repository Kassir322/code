// middleware.js (в корне проекта)
import { NextResponse } from 'next/server'

export function middleware(request) {
	// Получаем токен из cookies (не из localStorage!)
	const token = request.cookies.get('token')?.value

	// Проверяем, является ли маршрут защищенным
	if (request.nextUrl.pathname.startsWith('/account')) {
		// Исключаем страницы авторизации
		if (
			request.nextUrl.pathname.includes('/login') ||
			request.nextUrl.pathname.includes('/register') ||
			request.nextUrl.pathname.includes('/forgot-password')
		) {
			return NextResponse.next()
		}

		// Если нет токена, перенаправляем на страницу входа
		if (!token) {
			const loginUrl = new URL('/account/login', request.url)
			loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
			return NextResponse.redirect(loginUrl)
		}
	}

	return NextResponse.next()
}

// Настраиваем пути, для которых будет применяться middleware
export const config = {
	matcher: ['/account/:path*'],
}
