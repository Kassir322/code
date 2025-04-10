'use client'
// client/src/components/ui/LegalConsent.js
import React, { useState } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

/**
 * Компонент для отображения чекбоксов согласия с правовыми документами
 *
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.value - Значение чекбокса
 * @param {Function} props.onChange - Функция обработки изменения чекбокса
 * @param {string} props.errorMessage - Текст ошибки (если есть)
 * @param {boolean} props.showError - Флаг отображения ошибки
 * @param {string} props.type - Тип согласия: 'all' (все документы), 'privacy' (только политика конфиденциальности), 'terms' (только правила пользования)
 * @param {string} props.className - Дополнительные CSS классы
 * @returns {JSX.Element}
 */
export default function LegalConsent({
	value = false,
	onChange,
	errorMessage,
	showError = false,
	type = 'all',
	className = '',
}) {
	// Функция обработки изменения чекбокса
	const handleChange = (e) => {
		if (onChange) {
			onChange(e.target.checked)
		}
	}

	// Выбор текста в зависимости от типа согласия
	const getConsentText = () => {
		switch (type) {
			case 'privacy':
				return (
					<>
						Я согласен с{' '}
						<Link
							href="/legal/privacy-policy"
							target="_blank"
							className="text-secondary-blue hover:underline"
						>
							Политикой конфиденциальности
						</Link>{' '}
						и даю согласие на обработку моих персональных данных
					</>
				)
			case 'terms':
				return (
					<>
						Я согласен с{' '}
						<Link
							href="/legal/terms-of-use"
							target="_blank"
							className="text-secondary-blue hover:underline"
						>
							Правилами пользования сайтом
						</Link>
					</>
				)
			case 'all':
			default:
				return (
					<>
						Я согласен с{' '}
						<Link
							href="/legal/public-offer"
							target="_blank"
							className="text-secondary-blue hover:underline"
						>
							Договором публичной оферты
						</Link>
						,{' '}
						<Link
							href="/legal/privacy-policy"
							target="_blank"
							className="text-secondary-blue hover:underline"
						>
							Политикой конфиденциальности
						</Link>{' '}
						и{' '}
						<Link
							href="/legal/terms-of-use"
							target="_blank"
							className="text-secondary-blue hover:underline"
						>
							Правилами пользования сайтом
						</Link>
					</>
				)
		}
	}

	return (
		<div className={`${className}`}>
			<div className="flex items-start">
				<div className="flex h-5 items-center">
					<input
						id="legal-consent"
						name="legal-consent"
						type="checkbox"
						checked={value}
						onChange={handleChange}
						className="h-4 w-4 rounded border-gray-300 text-secondary-blue focus:ring-secondary-blue cursor-pointer"
						required
					/>
				</div>
				<div className="ml-3 text-sm">
					<label
						htmlFor="legal-consent"
						className="text-gray-600 cursor-pointer"
					>
						{getConsentText()}
					</label>
				</div>
			</div>

			{/* Сообщение об ошибке */}
			{showError && errorMessage && (
				<div className="mt-2 flex items-center text-red-500 text-xs">
					<AlertCircle className="h-4 w-4 mr-1" />
					<span>{errorMessage}</span>
				</div>
			)}
		</div>
	)
}
