'use client'
// client/src/components/checkout/CheckoutLegalConsent.js
import React, { useState } from 'react'
import LegalConsent from '@/components/ui/LegalConsent'

/**
 * Компонент формы с согласием на обработку персональных данных для страницы оформления заказа
 * @returns {JSX.Element}
 */
export default function CheckoutLegalConsent() {
	// Состояние для согласия с публичной офертой и политикой конфиденциальности
	const [termsAccepted, setTermsAccepted] = useState(false)
	const [privacyAccepted, setPrivacyAccepted] = useState(false)

	// Состояние для отображения ошибок
	const [showTermsError, setShowTermsError] = useState(false)
	const [showPrivacyError, setShowPrivacyError] = useState(false)

	// Обработчик отправки формы
	const handleSubmit = (e) => {
		e.preventDefault()

		// Проверка согласия с правовыми документами
		if (!termsAccepted) {
			setShowTermsError(true)
		} else {
			setShowTermsError(false)
		}

		if (!privacyAccepted) {
			setShowPrivacyError(true)
		} else {
			setShowPrivacyError(false)
		}

		// Если все согласия приняты, продолжаем оформление заказа
		if (termsAccepted && privacyAccepted) {
			// Здесь будет логика для продолжения оформления заказа
			alert('Заказ отправлен на оформление!')
		}
	}

	return (
		<div className="mt-6 bg-white rounded-lg shadow-sm p-6">
			<h3 className="text-lg font-semibold mb-4">Подтверждение заказа</h3>

			<form onSubmit={handleSubmit}>
				<div className="space-y-4">
					{/* Согласие с правилами пользования сайтом */}
					<LegalConsent
						value={termsAccepted}
						onChange={setTermsAccepted}
						type="terms"
						showError={showTermsError}
						errorMessage="Необходимо согласиться с правилами пользования сайтом"
					/>

					{/* Согласие с политикой конфиденциальности */}
					<LegalConsent
						value={privacyAccepted}
						onChange={setPrivacyAccepted}
						type="privacy"
						showError={showPrivacyError}
						errorMessage="Необходимо согласиться с политикой конфиденциальности"
					/>

					<div className="pt-4">
						<button
							type="submit"
							className="w-full bg-secondary-blue text-white rounded-md py-3 px-4 font-medium hover:bg-blue-700 transition-colors cursor-pointer"
						>
							Оформить заказ
						</button>
					</div>
				</div>
			</form>
		</div>
	)
}
