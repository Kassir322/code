'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

/**
 * Умная ссылка, которая обновляет данные страницы при навигации
 * Решает проблему с ISR и клиентской навигацией, когда данные не обновляются
 * при переходе по ссылкам, а только при полной перезагрузке (F5)
 *
 * @param {Object} props - Свойства компонента
 * @param {string} props.href - URL для перехода
 * @param {boolean} props.forceRefresh - Принудительно обновить данные при переходе
 * @param {React.ReactNode} props.children - Дочерние элементы
 * @param {Object} props.rest - Все остальные свойства будут переданы компоненту Link
 */
export default function SmartLink({
	href,
	forceRefresh = true,
	children,
	...rest
}) {
	const router = useRouter()

	const handleClick = (e) => {
		if (forceRefresh) {
			e.preventDefault()

			// Сначала переходим по ссылке
			router.push(href)

			// Затем принудительно обновляем данные
			// Это заставит Next.js запросить свежие данные с сервера
			router.refresh()
		}
	}

	return (
		<Link href={href} onClick={handleClick} {...rest}>
			{children}
		</Link>
	)
}
