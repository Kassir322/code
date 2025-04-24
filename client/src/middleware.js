// middleware.js
import { NextResponse } from 'next/server'

export async function middleware(request) {
	// Проверяем, является ли маршрут защищенным
	if (request.nextUrl.pathname.startsWith('/account')) {
		// Исключаем страницы авторизации
		if (
			request.nextUrl.pathname.includes('/login') ||
			request.nextUrl.pathname.includes('/register') ||
			request.nextUrl.pathname.includes('/forgot-password')
		) {
			console.log(`middleware.js скип`)

			return NextResponse.next()
		}

		// Получаем токен из куки
		const token = request.cookies.get('token')?.value

		// Если нет токена, перенаправляем на страницу входа
		if (!token) {
			const loginUrl = new URL('/account/login', request.url)
			loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
			return NextResponse.redirect(loginUrl)
		}

		// Проверяем валидность токена через API
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)

			if (!response.ok) {
				throw new Error('Invalid token')
			}
			console.log(`middleware.js response ${JSON.stringify(response)}`)
		} catch (error) {
			console.log(`middleware.js error ${JSON.stringify(error)}`)

			// Если токен невалидный, перенаправляем на страницу входа
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
