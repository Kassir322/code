// src/app/cart/checkout/success/page.js
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { CheckCircle, Package, ArrowLeft, ShoppingBag } from 'lucide-react'
import { useGetOrderDetailsQuery } from '@/store/services/orderApi'

export default function OrderSuccessPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [orderId, setOrderId] = useState(null)

	// Получаем ID заказа из URL параметров
	useEffect(() => {
		const id = searchParams?.get('orderId')
		if (id) {
			setOrderId(id)
		} else {
			// Если нет ID заказа, перенаправляем на страницу каталога
			router.push('/catalog')
		}
	}, [searchParams, router])

	// Получаем детали заказа, если есть ID
	const {
		data: orderData,
		isLoading,
		error,
	} = useGetOrderDetailsQuery(orderId, {
		skip: !orderId,
	})

	// Хлебные крошки для SEO и навигации
	const breadcrumbItems = [
		{ name: 'Главная', url: '/' },
		{ name: 'Корзина', url: '/cart' },
		{ name: 'Оформление заказа', url: '/cart/checkout' },
		{ name: 'Заказ оформлен', url: '/cart/checkout/success' },
	]

	return (
		<div className="container mx-auto px-4 mt-24 mb-16">
			<Breadcrumbs items={breadcrumbItems} />

			<div className="max-w-3xl mx-auto">
				<div className="bg-white rounded-lg shadow-sm p-8 text-center">
					<div className="flex flex-col items-center">
						<div className="bg-green-100 rounded-full p-4 mb-6">
							<CheckCircle className="h-16 w-16 text-green-600" />
						</div>

						<h1 className="text-3xl font-bold mb-4">Заказ успешно оформлен!</h1>

						<div className="max-w-lg mb-6">
							<p className="text-gray-700 mb-3">
								Спасибо за ваш заказ! Мы начали его обработку и скоро отправим
								вам все необходимые учебные материалы.
							</p>

							{orderData && (
								<div className="text-center mb-4">
									<p className="text-gray-700">
										Номер вашего заказа:{' '}
										<span className="font-bold">#{orderId}</span>
									</p>
									{orderData.payment_method && (
										<p className="text-gray-700">
											Способ оплаты:{' '}
											<span className="font-medium">
												{orderData.payment_method}
											</span>
										</p>
									)}
								</div>
							)}

							<p className="text-gray-700">
								Вы можете отслеживать статус заказа в личном кабинете.
								Информация о статусе также будет отправлена на вашу электронную
								почту.
							</p>
						</div>

						<div className="flex flex-col sm:flex-row justify-center gap-4 mt-2">
							<Link
								href="/account/orders"
								className="bg-secondary-blue text-white py-3 px-6 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center"
							>
								<Package className="h-5 w-5 mr-2" />
								Мои заказы
							</Link>

							<Link
								href="/catalog"
								className="bg-white border border-gray-300 text-gray-800 py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center"
							>
								<ShoppingBag className="h-5 w-5 mr-2" />
								Продолжить покупки
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
