// src/components/checkout/PaymentMethodSelector.js
'use client'

import { useState } from 'react'
import { CreditCard, Smartphone, AlertCircle } from 'lucide-react'

/**
 * Компонент для выбора способа оплаты
 * @param {Object} props - Свойства компонента
 * @param {string} props.selectedMethod - Выбранный способ оплаты
 * @param {Function} props.onSelect - Функция выбора способа оплаты
 * @returns {JSX.Element}
 */
export default function PaymentMethodSelector({ selectedMethod, onSelect }) {
	const [error, setError] = useState(null)

	// Доступные способы оплаты
	const paymentMethods = [
		{
			id: 'yookassa_redirect',
			name: 'Банковская карта',
			description: 'Visa, MasterCard, Мир',
			icon: <CreditCard className="h-5 w-5" />,
		},
		{
			id: 'sbp',
			name: 'Система быстрых платежей (СБП)',
			description: 'Оплата по QR-коду через мобильный банк',
			icon: <Smartphone className="h-5 w-5" />,
		},
	]

	// Функция выбора способа оплаты
	const handleSelectMethod = (method) => {
		setError(null)
		onSelect(method)
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-medium mb-4">Способ оплаты</h3>

			{error && (
				<div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
					<div className="flex items-start">
						<AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
						<p className="text-red-700 text-sm">{error}</p>
					</div>
				</div>
			)}

			<div className="space-y-3">
				{paymentMethods.map((method) => (
					<div
						key={method.id}
						className={`border rounded-lg p-4 cursor-pointer ${
							selectedMethod?.id === method.id
								? 'border-secondary-blue ring-1 ring-secondary-blue'
								: 'border-gray-200 hover:border-gray-300'
						}`}
						onClick={() => handleSelectMethod(method)}
					>
						<div className="flex items-center">
							<div className="flex-shrink-0 mr-3">
								<input
									type="radio"
									name="paymentMethod"
									checked={selectedMethod?.id === method.id}
									onChange={() => handleSelectMethod(method)}
									className="h-4 w-4 text-secondary-blue focus:ring-secondary-blue border-gray-300"
								/>
							</div>

							<div className="flex items-center flex-1">
								<div className="mr-3 text-gray-500">{method.icon}</div>
								<div>
									<p className="font-medium">{method.name}</p>
									<p className="text-sm text-gray-500">{method.description}</p>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
