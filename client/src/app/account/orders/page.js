'use client'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { getUserOrders } from '@/lib/api'
import {
	selectCurrentUser,
	selectIsAuthenticated,
} from '@/store/slices/authSlice'
import Breadcrumbs from '@/components/Breadcrumbs'

const OrderStatus = ({ status }) => {
	const statusColors = {
		pending: 'bg-blue-100 text-blue-800',
		paid: 'bg-green-100 text-green-800',
		completed: 'bg-green-100 text-green-800',
		cancelled: 'bg-red-100 text-red-800',
	}

	const statusText = {
		pending: 'В обработке',
		paid: 'Оплачен',
		completed: 'Выполнен',
		cancelled: 'Отменён',
	}

	return (
		<span
			className={`px-2 py-1 rounded-full text-sm font-medium ${
				statusColors[status] || 'bg-gray-100 text-gray-800'
			}`}
		>
			{statusText[status] || status}
		</span>
	)
}

const OrdersPage = () => {
	const user = useSelector(selectCurrentUser)
	const isAuthenticated = useSelector(selectIsAuthenticated)
	const [orders, setOrders] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchOrders = async () => {
			if (!user?.id) return

			try {
				const data = await getUserOrders(user.id)
				setOrders(data)
			} catch (error) {
				console.error('Error fetching orders:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchOrders()
	}, [user])

	const breadcrumbs = [
		{ name: 'Главная', url: '/' },
		{ name: 'Личный кабинет', url: '/account' },
		{ name: 'Мои заказы', url: '/account/orders' },
	]

	if (loading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Breadcrumbs items={breadcrumbs} />
				<div className="flex justify-center items-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
				</div>
			</div>
		)
	}

	if (!isAuthenticated) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Breadcrumbs items={breadcrumbs} />
				<div className="text-center py-12">
					<h2 className="text-2xl font-semibold mb-4">Требуется авторизация</h2>
					<p className="text-gray-600 mb-6">
						Пожалуйста, войдите в свой аккаунт, чтобы просмотреть заказы
					</p>
					<Link
						href="/account/login"
						className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
					>
						Войти
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Breadcrumbs items={breadcrumbs} />

			<h1 className="text-3xl font-bold mb-8">Мои заказы</h1>

			{orders.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-gray-600 mb-6">У вас пока нет заказов</p>
					<Link
						href="/catalog"
						className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
					>
						Перейти в каталог
					</Link>
				</div>
			) : (
				<div className="space-y-6">
					{orders.map((order) => (
						<Link
							key={order.id}
							href={`/orders/${order.id}`}
							className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
						>
							<div className="flex justify-between items-start mb-4">
								<div>
									<h3 className="text-lg font-semibold">Заказ #{order.id}</h3>
									<p className="text-gray-600">
										{format(new Date(order.createdAt), 'd MMMM yyyy, HH:mm', {
											locale: ru,
										})}
									</p>
								</div>
								<OrderStatus status={order.orderStatus} />
							</div>

							<div className="border-t border-gray-200 pt-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<h4 className="font-medium mb-2">Информация о доставке</h4>
										<p className="text-gray-600">
											{order.shippingAddress?.recipient_name}
											<br />
											{order.shippingAddress?.recipient_phone}
											<br />
											{order.shippingAddress?.city},{' '}
											{order.shippingAddress?.street},{' '}
											{order.shippingAddress?.house}
											{order.shippingAddress?.building &&
												`, к. ${order.shippingAddress.building}`}
											{order.shippingAddress?.apartment &&
												`, кв. ${order.shippingAddress.apartment}`}
										</p>
									</div>
									<div>
										<h4 className="font-medium mb-2">Способ доставки</h4>
										<p className="text-gray-600">
											{order.shippingMethod === 'post' && 'Почта России'}
											{order.shippingMethod === 'pickup' && 'Самовывоз'}
											{order.shippingMethod === 'sdek' && 'СДЭК'}
											{order.shippingMethod === 'post5' &&
												'Почта России (5 дней)'}
											{order.shippingMethod === 'boxberry' && 'Boxberry'}
										</p>
									</div>
								</div>
							</div>

							<div className="border-t border-gray-200 pt-4 mt-4">
								<h4 className="font-medium mb-2">Товары</h4>
								<div className="space-y-2">
									{order.orderItems?.map((item) => (
										<div
											key={item.id}
											className="flex justify-between items-center"
										>
											<div>
												<p className="font-medium">{item.title}</p>
												<p className="text-gray-600">
													Количество: {item.quantity}
												</p>
											</div>
											<p className="font-medium">{item.price} ₽</p>
										</div>
									))}
								</div>
								<div className="border-t border-gray-200 mt-4 pt-4">
									<div className="flex justify-between items-center">
										<p className="font-medium">Итого:</p>
										<p className="text-xl font-bold">{order.totalAmount} ₽</p>
									</div>
								</div>
							</div>

							{order.trackingNumber && (
								<div className="border-t border-gray-200 pt-4 mt-4">
									<h4 className="font-medium mb-2">Трек-номер</h4>
									<p className="text-gray-600">{order.trackingNumber}</p>
								</div>
							)}

							{order.notes && (
								<div className="border-t border-gray-200 pt-4 mt-4">
									<h4 className="font-medium mb-2">Примечания</h4>
									<p className="text-gray-600">{order.notes}</p>
								</div>
							)}
						</Link>
					))}
				</div>
			)}
		</div>
	)
}

export default OrdersPage
