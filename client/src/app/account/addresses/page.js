'use client'

import { useGetUserQuery } from '@/store/services/authApi'
import AddressList from '@/components/address/AddressList'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// // Метаданные для SEO
// export const metadata = {
// 	title: 'Управление адресами | Mat-Focus',
// 	description:
// 		'Управляйте сохраненными адресами доставки в личном кабинете Mat-Focus',
// 	openGraph: {
// 		title: 'Управление адресами | Mat-Focus',
// 		description:
// 			'Управляйте сохраненными адресами доставки в личном кабинете Mat-Focus',
// 		type: 'website',
// 	},
// }

export default function AddressesPage() {
	const { data: user, isLoading, isError } = useGetUserQuery()

	console.log('AddressesPage render:', { user, isLoading, isError })

	// Перенаправляем неавторизованных пользователей на страницу входа
	if (isLoading) {
		console.log('Showing loading state')
		return (
			<div className="container mx-auto px-4 py-10">
				{/* <Breadcrumbs items={breadcrumbItems} /> */}
				<div className="flex justify-center items-center py-20">
					<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-secondary-blue"></div>
				</div>
			</div>
		)
	}

	// Если пользователь не авторизован или произошла ошибка
	// if (isError || !user) {
	// 	console.log('Redirecting to login - error or no user:', { isError, user })
	// 	router.push('/account/login?redirect=/account/addresses')
	// 	return null // Middleware перенаправит на страницу входа
	// }

	console.log('Rendering main content')
	return (
		<div className="container mx-auto px-4 py-10">
			{/* Хлебные крошки для SEO и навигации */}
			{/* <Breadcrumbs items={breadcrumbItems} /> */}

			<div className="max-w-4xl mx-auto">
				<header className="mb-8">
					<div className="flex items-center mb-2">
						<Link
							href="/account"
							className="text-secondary-blue hover:underline mr-4 flex items-center"
						>
							<ArrowLeft className="h-4 w-4 mr-1" />
							<span>Назад в личный кабинет</span>
						</Link>
					</div>

					<h1 className="text-2xl font-bold">Адреса доставки</h1>
					<p className="text-gray-600 mt-1">
						Управляйте сохраненными адресами доставки для быстрого оформления
						заказов
					</p>
				</header>

				{/* Компонент списка адресов */}
				<div className="bg-white shadow-sm rounded-lg p-6">
					<AddressList />
				</div>
			</div>
		</div>
	)
}
