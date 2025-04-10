import { Roboto } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import StoreProvider from '@/components/StoreProvider'
import CookieConsent from '@/components/ui/CookieConsent'

const roboto = Roboto({ subsets: ['cyrillic', 'latin'] })

export const metadata = {
	title: 'Mat-Focus | Учебные материалы',
	description:
		'Интернет-магазин учебных карточек и материалов для эффективного обучения',
}

export default function RootLayout({ children }) {
	return (
		<html lang="ru">
			<body className={`${roboto.className} bg-neutral-01`}>
				<StoreProvider>
					<Header />
					<div className="mb-24"></div>
					<main className="min-h-screen container mx-auto relative">
						{children}
					</main>
					<Footer />
					<CookieConsent />
				</StoreProvider>
			</body>
		</html>
	)
}
