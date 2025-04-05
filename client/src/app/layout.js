import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
	title: 'Mat-Focus | Учебные материалы',
	description:
		'Интернет-магазин учебных карточек и материалов для эффективного обучения',
}

export default function RootLayout({ children }) {
	return (
		<html lang="ru">
			<body className={inter.className}>
				<Header />
				{/* <main className="min-h-screen">{children}</main> */}
				<Footer />
			</body>
		</html>
	)
}
