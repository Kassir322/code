'use client'
// client/src/components/ui/CookieConsent.js
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

/**
 * Компонент уведомления о использовании cookies на сайте
 * @returns {JSX.Element}
 */
export default function CookieConsent() {
	const [showConsent, setShowConsent] = useState(false)

	// При монтировании компонента проверяем, было ли уже принято согласие
	useEffect(() => {
		// Задержка для улучшения UX - показать уведомление не сразу
		const timer = setTimeout(() => {
			const consented = localStorage.getItem('cookieConsent')
			if (!consented) {
				setShowConsent(true)
			}
		}, 1000)

		return () => clearTimeout(timer)
	}, [])

	// Обработчик принятия соглашения
	const handleAccept = () => {
		localStorage.setItem('cookieConsent', 'true')
		setShowConsent(false)
	}

	// Обработчик закрытия уведомления без принятия
	const handleClose = () => {
		setShowConsent(false)
	}

	if (!showConsent) return null

	return (
		<div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-07 text-white p-4 shadow-lg">
			<div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
				<div className="mb-4 md:mb-0 md:mr-6 text-center md:text-left">
					<p className="text-sm md:text-base">
						Мы используем файлы cookie для улучшения работы сайта. Продолжая
						использовать наш сайт, вы соглашаетесь с{' '}
						<Link
							href="/legal/privacy-policy"
							className="underline hover:text-neutral-01 transition-colors"
							target="_blank"
						>
							политикой использования файлов cookie
						</Link>
						.
					</p>
				</div>

				<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
					<button
						onClick={handleAccept}
						className="px-6 py-2 bg-secondary-blue hover:bg-blue-700 text-white rounded-md transition-colors cursor-pointer"
					>
						Принять
					</button>

					<button
						onClick={handleClose}
						className="px-6 py-2 bg-transparent border border-white hover:bg-neutral-06 text-white rounded-md transition-colors cursor-pointer"
					>
						Закрыть
					</button>

					<button
						onClick={handleClose}
						className="absolute top-2 right-2 md:hidden text-white hover:text-neutral-01 transition-colors cursor-pointer"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
			</div>
		</div>
	)
}
