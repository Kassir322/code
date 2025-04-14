// Обновленный файл: client/src/app/cart/checkout/success/page.js
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Breadcrumbs from '@/components/Breadcrumbs'
import {
	CheckCircle,
	Package,
	ArrowLeft,
	ShoppingBag,
	AlertCircle,
	CreditCard,
} from 'lucide-react'
import { useGetOrderDetailsQuery } from '@/store/services/orderApi'
import { usePaymentService } from '@/store/services/paymentService'
import SchemaOrg from '@/components/SchemaOrg'
import { useDispatch } from 'react-redux'
import { clearCart } from '@/store/slices/cartSlice'

export default function OrderSuccessPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [orderId, setOrderId] = useState(null)
	const [agreeToPayment, setAgreeToPayment] = useState(false)
	const [isPaymentInitiating, setIsPaymentInitiating] = useState(false)
	const [paymentError, setPaymentError] = useState(null)
	const dispatch = useDispatch()

	// Получаем сервис для работы с платежами
	const { initiatePayment, isCreatingPayment } = usePaymentService()

	// Получаем ID заказа из URL параметров
	useEffect(() => {
		//тут нужно выполнить проверку, есть ли данный заказ у пользователя
		//если есть, то оставить его на странице описания заказа
		//если нет, то вывести сообщение о том, что заказа принадлежит другому
		//пользователю. Сообщение должно быть в виде контента на странице, а не модального окна

		dispatch(clearCart())
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

	// Обработчик перехода к оплате
	const handleProceedToPayment = async () => {
		if (!agreeToPayment || !orderData) return

		setIsPaymentInitiating(true)
		setPaymentError(null)

		try {
			// Формируем данные для создания платежа
			const paymentData = {
				amount: orderData.total_amount,
				description: `Оплата заказа #${orderId} в Mat-Focus`,
				orderId: orderId,
				paymentMethod: 'yookassa_redirect', // По умолчанию используем переадресацию на страницу ЮKassa
			}
			console.log(paymentData)

			// Используем сервис для инициации платежа через Redux
			const result = await initiatePayment(paymentData)
			console.log(result)

			if (result.success && result.confirmationUrl) {
				// Перенаправляем пользователя на страницу оплаты
				window.location.href = result.confirmationUrl
			} else {
				setPaymentError(
					result.error ||
						'Не удалось создать платеж. Пожалуйста, попробуйте позже.'
				)
			}
		} catch (error) {
			console.error('Ошибка при инициализации платежа:', error)
			setPaymentError(
				'Произошла ошибка. Пожалуйста, попробуйте позже или свяжитесь с поддержкой.'
			)
		} finally {
			setIsPaymentInitiating(false)
		}
	}

	// Генерируем Schema.org разметку для улучшения SEO
	const generateOrderSchema = () => {
		if (!orderData) return null

		return {
			'@context': 'https://schema.org',
			'@type': 'Order',
			orderNumber: orderId,
			orderStatus: 'https://schema.org/OrderProcessing',
			merchant: {
				'@type': 'Organization',
				name: 'Mat-Focus',
			},
			acceptedOffer:
				orderData.order_items?.map((item) => ({
					'@type': 'Offer',
					itemOffered: {
						'@type': 'Product',
						name: item.study_card?.title || 'Учебные карточки',
					},
					price: item.price,
					priceCurrency: 'RUB',
					quantity: item.quantity,
				})) || [],
			priceSpecification: {
				'@type': 'PriceSpecification',
				price: orderData.total_amount,
				priceCurrency: 'RUB',
			},
		}
	}

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 mt-24 mb-16 flex justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary-blue"></div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 mt-24 mb-16">
				<Breadcrumbs items={breadcrumbItems} />
				<div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-start text-red-600 mb-4">
						<AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
						<p>
							Не удалось загрузить информацию о заказе. Пожалуйста, проверьте
							номер заказа.
						</p>
					</div>
					<Link
						href="/catalog"
						className="inline-flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Вернуться в каталог
					</Link>
				</div>
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 mt-24 mb-16">
			<Breadcrumbs items={breadcrumbItems} />

			{/* Schema.org разметка для SEO */}
			{orderData && <SchemaOrg data={generateOrderSchema()} />}

			<div className="max-w-3xl mx-auto">
				<div className="bg-white rounded-lg shadow-sm p-8">
					<div className="flex flex-col items-center text-center mb-8">
						<div className="bg-green-100 rounded-full p-4 mb-6">
							<CheckCircle className="h-16 w-16 text-green-600" />
						</div>

						<h1 className="text-3xl font-bold mb-4">Заказ успешно оформлен!</h1>

						<div className="max-w-lg">
							<p className="text-gray-700 mb-3">
								Спасибо за ваш заказ! Мы начали его обработку и скоро отправим
								вам все необходимые учебные материалы.
							</p>

							{orderData && (
								<div className="text-center mb-4">
									<p className="text-gray-700 text-lg">
										Номер вашего заказа:{' '}
										<span className="font-bold">#{orderId}</span>
									</p>
								</div>
							)}
						</div>
					</div>

					{/* Детали заказа */}
					{orderData && (
						<div className="border-t border-b border-gray-200 py-6 mb-6">
							<h2 className="text-xl font-semibold mb-4">Детали заказа</h2>

							<div className="space-y-4">
								{/* Информация о доставке */}
								<div>
									<h3 className="font-medium text-gray-700">
										Способ доставки:
									</h3>
									<p className="mt-1">
										{orderData.shipping_method === 'sdek' && 'СДЭК'}
										{orderData.shipping_method === 'post' && 'Почта России'}
										{orderData.shipping_method === 'boxberry' && 'Boxberry'}
										{orderData.shipping_method === '5post' && '5Post'}
										{!['sdek', 'post', 'boxberry', '5post'].includes(
											orderData.shipping_method
										) && orderData.shipping_method}
									</p>
								</div>

								{/* Адрес доставки */}
								{orderData.shipping_address && (
									<div>
										<h3 className="font-medium text-gray-700">
											Адрес доставки:
										</h3>
										<p className="mt-1">
											{orderData.shipping_address.recipient_name},{' '}
											{orderData.shipping_address.city},{' '}
											{orderData.shipping_address.street}, дом{' '}
											{orderData.shipping_address.house}
											{orderData.shipping_address.apartment &&
												`, кв. ${orderData.shipping_address.apartment}`}
										</p>
									</div>
								)}

								{/* Способ оплаты */}
								<div>
									<h3 className="font-medium text-gray-700">Способ оплаты:</h3>
									<p className="mt-1">
										{orderData.payment_method === 'card' && 'Банковская карта'}
										{orderData.payment_method === 'cash' &&
											'Наличными при получении'}
										{!['card', 'cash'].includes(orderData.payment_method) &&
											orderData.payment_method}
									</p>
								</div>

								{/* Товары */}
								<div>
									<h3 className="font-medium text-gray-700 mb-2">Товары:</h3>
									<div className="space-y-2">
										{orderData.order_items?.map((item, index) => (
											<div key={index} className="flex justify-between">
												<div>
													<p>
														{item.study_card?.title ||
															`Товар #${item.study_card?.id || 'N/A'}`}
														<span className="text-gray-500 ml-2">
															× {item.quantity}
														</span>
													</p>
												</div>
												<p className="font-medium">
													{item.price * item.quantity} ₽
												</p>
											</div>
										))}
									</div>
								</div>

								{/* Комментарий к заказу */}
								{orderData.notes && (
									<div>
										<h3 className="font-medium text-gray-700">
											Комментарий к заказу:
										</h3>
										<p className="mt-1">{orderData.notes}</p>
									</div>
								)}

								{/* Итоговая сумма */}
								<div className="pt-4 border-t border-gray-200">
									<div className="flex justify-between text-lg font-bold">
										<h3>Итого:</h3>
										<p>{orderData.total_amount} ₽</p>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Блок оплаты */}
					{orderData && orderData.payment_method === 'card' && (
						<div className="mb-6">
							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
								<div className="flex items-start">
									<CreditCard className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
									<div>
										<h3 className="font-medium text-blue-700">
											Ваш заказ ожидает оплаты
										</h3>
										<p className="text-blue-600 mt-1">
											Для завершения оформления заказа, пожалуйста, произведите
											оплату. После подтверждения оплаты мы начнем обработку
											вашего заказа.
										</p>
									</div>
								</div>
							</div>

							{/* Ошибка при инициализации платежа */}
							{paymentError && (
								<div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
									<div className="flex items-start">
										<AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
										<div>
											<h3 className="font-medium text-red-700">
												Ошибка при создании платежа
											</h3>
											<p className="text-red-600 mt-1">{paymentError}</p>
										</div>
									</div>
								</div>
							)}

							{/* Чекбокс подтверждения и кнопка оплаты */}
							<div className="space-y-4">
								<label className="flex items-start cursor-pointer">
									<input
										type="checkbox"
										checked={agreeToPayment}
										onChange={(e) => setAgreeToPayment(e.target.checked)}
										className="mt-1 h-4 w-4 text-secondary-blue focus:ring-secondary-blue rounded cursor-pointer"
									/>
									<span className="ml-3 text-sm text-gray-600">
										Я ознакомился с деталями заказа, подтверждаю их правильность
										и хочу перейти к оплате. Я согласен с
										<Link
											href="/legal/terms-of-use"
											className="text-secondary-blue hover:underline ml-1"
											target="_blank"
										>
											условиями использования
										</Link>
									</span>
								</label>

								<button
									onClick={handleProceedToPayment}
									disabled={
										!agreeToPayment || isPaymentInitiating || isCreatingPayment
									}
									className={`w-full py-3 px-6 rounded-md font-medium flex items-center justify-center cursor-pointer
                    ${
											!agreeToPayment ||
											isPaymentInitiating ||
											isCreatingPayment
												? 'bg-gray-300 text-gray-500 cursor-not-allowed'
												: 'bg-secondary-blue text-white hover:bg-blue-700 transition-colors'
										}`}
								>
									{isPaymentInitiating || isCreatingPayment ? (
										<>
											<div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
											Подготовка платежа...
										</>
									) : (
										<>
											<CreditCard className="mr-2 h-5 w-5" />
											Перейти к оплате
										</>
									)}
								</button>
							</div>
						</div>
					)}

					{/* Кнопки навигации */}
					<div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
						<Link
							href="/account/orders"
							className="bg-white border border-gray-300 text-gray-800 py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center"
						>
							<Package className="h-5 w-5 mr-2" />
							Мои заказы
						</Link>

						<Link
							href="/catalog"
							className="bg-dark text-white py-3 px-6 rounded-md font-medium hover:bg-hover transition-colors cursor-pointer flex items-center justify-center"
						>
							<ShoppingBag className="h-5 w-5 mr-2" />
							Продолжить покупки
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
