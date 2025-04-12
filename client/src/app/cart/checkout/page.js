'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCartItems, selectCartTotal } from '@/store/slices/cartSlice'
import { useRouter } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import Link from 'next/link'
import { ArrowLeft, CreditCard, Truck, ShoppingBag } from 'lucide-react'
import AddressSelector from '@/components/address/AddressSelector'
import { useGetUserQuery } from '@/store/services/authApi'

// // Метаданные для SEO
// export const metadata = {
// 	title: 'Оформление заказа | Mat-Focus',
// 	description:
// 		'Оформите заказ в интернет-магазине Mat-Focus. Выберите адрес доставки и способ оплаты.',
// 	openGraph: {
// 		title: 'Оформление заказа | Mat-Focus',
// 		description:
// 			'Оформите заказ в интернет-магазине Mat-Focus. Выберите адрес доставки и способ оплаты.',
// 		type: 'website',
// 	},
// }

export default function CheckoutPage() {
	const router = useRouter()
	const cartItems = useSelector(selectCartItems)
	const cartTotal = useSelector(selectCartTotal)
	const { data: user, isLoading: isUserLoading } = useGetUserQuery()

	// Состояния для формы оформления заказа
	const [selectedAddress, setSelectedAddress] = useState(null)
	const [deliveryMethod, setDeliveryMethod] = useState(null)
	const [paymentMethod, setPaymentMethod] = useState(null)
	const [note, setNote] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Доступные способы доставки
	const deliveryMethods = [
		{
			id: 'sdek',
			name: 'СДЭК',
			price: 300,
			days: '1-3',
			icon: <Truck className="h-5 w-5" />,
		},
		{
			id: 'post',
			name: 'Почта России',
			price: 250,
			days: '3-7',
			icon: <Truck className="h-5 w-5" />,
		},
		{
			id: 'boxberry',
			name: 'Boxberry',
			price: 280,
			days: '2-4',
			icon: <Truck className="h-5 w-5" />,
		},
		{
			id: '5post',
			name: '5Post',
			price: 270,
			days: '2-5',
			icon: <Truck className="h-5 w-5" />,
		},
	]

	// Доступные способы оплаты
	const paymentMethods = [
		{
			id: 'card',
			name: 'Банковская карта',
			icon: <CreditCard className="h-5 w-5" />,
		},
		{
			id: 'cash',
			name: 'Наличными при получении',
			icon: <ShoppingBag className="h-5 w-5" />,
		},
	]

	// Перенаправляем на страницу корзины, если она пуста
	useEffect(() => {
		if (cartItems.length === 0) {
			router.push('/cart')
		}
	}, [cartItems, router])

	// Выбираем первый способ доставки и оплаты по умолчанию
	useEffect(() => {
		if (deliveryMethods.length > 0 && !deliveryMethod) {
			setDeliveryMethod(deliveryMethods[0])
		}

		if (paymentMethods.length > 0 && !paymentMethod) {
			setPaymentMethod(paymentMethods[0])
		}
	}, [deliveryMethod, paymentMethod])

	// Обработчик отправки формы заказа
	const handleSubmitOrder = async (e) => {
		if (e) e.preventDefault()

		if (!selectedAddress || !deliveryMethod || !paymentMethod) {
			alert('Пожалуйста, заполните все обязательные поля')
			return
		}

		setIsSubmitting(true)

		try {
			// Здесь будет логика отправки заказа на сервер
			console.log('Оформление заказа', {
				items: cartItems,
				total: cartTotal,
				address: selectedAddress,
				delivery: deliveryMethod,
				payment: paymentMethod,
				note,
			})

			// Имитируем успешное оформление заказа
			setTimeout(() => {
				router.push('/cart/checkout/success?orderId=12345')
			}, 1500)
		} catch (error) {
			console.error('Ошибка при оформлении заказа:', error)
			setIsSubmitting(false)
		}
	}

	// Хлебные крошки для SEO и навигации
	const breadcrumbItems = [
		{ name: 'Главная', url: '/' },
		{ name: 'Корзина', url: '/cart' },
		{ name: 'Оформление заказа', url: '/cart/checkout' },
	]

	// Рассчитываем итоговую стоимость
	const deliveryPrice = deliveryMethod ? deliveryMethod.price : 0
	const totalPrice = cartTotal + deliveryPrice

	// Если корзина пуста, не отображаем страницу
	if (cartItems.length === 0) {
		return null
	}

	return (
		<div className="container mx-auto px-4 py-10">
			{/* Хлебные крошки для SEO */}
			<Breadcrumbs items={breadcrumbItems} />

			<div className="flex items-center mb-6">
				<Link
					href="/cart"
					className="text-secondary-blue hover:underline flex items-center"
				>
					<ArrowLeft className="h-4 w-4 mr-1" />
					<span>Вернуться в корзину</span>
				</Link>
			</div>

			<h1 className="text-2xl font-bold mb-8">Оформление заказа</h1>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Форма оформления заказа */}
				<div className="lg:col-span-2">
					<div className="space-y-8">
						{/* Адрес доставки */}
						<div className="bg-white shadow-sm rounded-lg p-6">
							<AddressSelector
								selectedAddress={selectedAddress}
								onSelect={setSelectedAddress}
								isInCheckoutForm={true}
							/>
						</div>

						{/* Способ доставки */}
						<div className="bg-white shadow-sm rounded-lg p-6">
							<h3 className="text-lg font-medium mb-4">Способ доставки</h3>

							<div className="space-y-3">
								{deliveryMethods.map((method) => (
									<div
										key={method.id}
										className={`border rounded-lg p-4 cursor-pointer ${
											deliveryMethod?.id === method.id
												? 'border-secondary-blue ring-1 ring-secondary-blue'
												: 'border-gray-200 hover:border-gray-300'
										}`}
										onClick={() => setDeliveryMethod(method)}
									>
										<div className="flex items-center">
											<div className="flex-shrink-0 mr-3">
												<input
													type="radio"
													name="deliveryMethod"
													checked={deliveryMethod?.id === method.id}
													onChange={() => setDeliveryMethod(method)}
													className="h-4 w-4 text-secondary-blue focus:ring-secondary-blue border-gray-300"
												/>
											</div>
											<div className="flex-1 flex items-center justify-between">
												<div className="flex items-center">
													<div className="mr-3 text-gray-500">
														{method.icon}
													</div>
													<div>
														<p className="font-medium">{method.name}</p>
														<p className="text-sm text-gray-500">
															Срок доставки: {method.days} дн.
														</p>
													</div>
												</div>
												<div className="font-medium">{method.price} ₽</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Способ оплаты */}
						<div className="bg-white shadow-sm rounded-lg p-6">
							<h3 className="text-lg font-medium mb-4">Способ оплаты</h3>

							<div className="space-y-3">
								{paymentMethods.map((method) => (
									<div
										key={method.id}
										className={`border rounded-lg p-4 cursor-pointer ${
											paymentMethod?.id === method.id
												? 'border-secondary-blue ring-1 ring-secondary-blue'
												: 'border-gray-200 hover:border-gray-300'
										}`}
										onClick={() => setPaymentMethod(method)}
									>
										<div className="flex items-center">
											<div className="flex-shrink-0 mr-3">
												<input
													type="radio"
													name="paymentMethod"
													checked={paymentMethod?.id === method.id}
													onChange={() => setPaymentMethod(method)}
													className="h-4 w-4 text-secondary-blue focus:ring-secondary-blue border-gray-300"
												/>
											</div>
											<div className="flex items-center">
												<div className="mr-3 text-gray-500">{method.icon}</div>
												<div>
													<p className="font-medium">{method.name}</p>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Комментарий к заказу */}
						<div className="bg-white shadow-sm rounded-lg p-6">
							<h3 className="text-lg font-medium mb-4">Комментарий к заказу</h3>

							<textarea
								value={note}
								onChange={(e) => setNote(e.target.value)}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-blue"
								rows="3"
								placeholder="Дополнительная информация по заказу (необязательно)"
							></textarea>
						</div>
					</div>
				</div>

				{/* Сводка заказа */}
				<div className="lg:col-span-1">
					<div className="bg-white shadow-sm rounded-lg p-6 sticky top-24">
						<h3 className="text-lg font-medium mb-4">Ваш заказ</h3>

						<div className="space-y-4 mb-6">
							{/* Товары */}
							{cartItems.map((item) => (
								<div key={item.id} className="flex justify-between">
									<div>
										<p className="font-medium">{item.name}</p>
										<p className="text-sm text-gray-500">{item.quantity} шт.</p>
									</div>
									<p className="font-medium">{item.price * item.quantity} ₽</p>
								</div>
							))}

							<div className="border-t border-gray-200 pt-4 mt-4">
								<div className="flex justify-between mb-2">
									<p className="text-gray-600">Товары:</p>
									<p>{cartTotal} ₽</p>
								</div>

								<div className="flex justify-between mb-2">
									<p className="text-gray-600">Доставка:</p>
									<p>{deliveryPrice} ₽</p>
								</div>

								<div className="flex justify-between font-bold text-lg mt-4">
									<p>Итого:</p>
									<p>{totalPrice} ₽</p>
								</div>
							</div>
						</div>

						<button
							type="button"
							onClick={handleSubmitOrder}
							disabled={
								isSubmitting ||
								!selectedAddress ||
								!deliveryMethod ||
								!paymentMethod
							}
							className={`w-full py-3 px-4 rounded-md font-medium text-center transition-colors cursor-pointer ${
								isSubmitting ||
								!selectedAddress ||
								!deliveryMethod ||
								!paymentMethod
									? 'bg-gray-400 text-white cursor-not-allowed'
									: 'bg-secondary-blue text-white hover:bg-blue-700'
							}`}
						>
							{isSubmitting ? 'Оформление...' : 'Подтвердить заказ'}
						</button>

						<p className="text-xs text-gray-500 mt-3 text-center">
							Нажимая кнопку, вы соглашаетесь с условиями
							<Link
								href="/legal/terms"
								className="text-secondary-blue hover:underline ml-1"
							>
								пользовательского соглашения
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
