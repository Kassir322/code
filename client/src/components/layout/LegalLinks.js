// client/src/components/layout/LegalLinks.js
import React from 'react'
import Link from 'next/link'

/**
 * Компонент со ссылками на юридические документы для футера сайта
 * @returns {JSX.Element}
 */
export default function LegalLinks() {
	const legalLinks = [
		{ name: 'Правовая информация', url: '/legal' },
		{ name: 'Договор публичной оферты', url: '/legal/public-offer' },
		{ name: 'Политика конфиденциальности', url: '/legal/privacy-policy' },
		{ name: 'Правила пользования сайтом', url: '/legal/terms-of-use' },
	]

	return (
		<ul className="space-y-2">
			{legalLinks.map((link) => (
				<li key={link.url}>
					<Link
						href={link.url}
						className="text-gray-600 hover:text-primary transition-colors"
					>
						{link.name}
					</Link>
				</li>
			))}
		</ul>
	)
}
