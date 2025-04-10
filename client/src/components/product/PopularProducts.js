'use client'
// src/components/product/PopularProducts.js (обновленная версия с поддержкой slug)
import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'

// Функция-заглушка для получения популярных товаров
const fetchPopularProducts = async (currentProductSlug) => {
	// В реальном приложении здесь будет запрос к API
	// const response = await fetch(`/api/products/popular?exclude=${currentProductSlug}`);
	// return await response.json();

	// Заглушка для демонстрации
	const mockProducts = [
		{
			id: currentProductSlug === '1' ? '10' : '1',
			name: 'Карточки по математике 5-6 класс',
			price: 890,
			oldPrice: 1190,
			rating: 4.8,
			reviewCount: 124,
			imageSrc: '/images/products/math-cards.jpg',
			subject: 'Математика',
			grade: '5-6 класс',
			card_type: 'Вопрос-ответ',
			quantity: 15,
			number_of_cards: 50,
			label: 'Хит продаж',
		},
		{
			id: currentProductSlug === '2' ? '11' : '2',
			name: 'Карточки по физике ОГЭ',
			price: 950,
			oldPrice: null,
			rating: 4.5,
			reviewCount: 87,
			imageSrc: '/images/products/physics-cards.jpg',
			subject: 'Физика',
			grade: '9 класс (ОГЭ)',
			card_type: 'Шпаргалки',
			quantity: 8,
			number_of_cards: 40,
			label: 'Новинка',
		},
		{
			id: currentProductSlug === '3' ? '12' : '3',
			name: 'Карточки по русскому языку ЕГЭ',
			price: 790,
			oldPrice: 990,
			rating: 4.7,
			reviewCount: 156,
			imageSrc: '/images/products/russian-cards.jpg',
			subject: 'Русский язык',
			grade: '11 класс (ЕГЭ)',
			card_type: 'Комбинированный',
			quantity: 12,
			number_of_cards: 60,
			label: 'Скидка 20%',
		},
		{
			id: currentProductSlug === '4' ? '13' : '4',
			name: 'Карточки по биологии 7-8 класс',
			price: 850,
			oldPrice: 1050,
			rating: 4.6,
			reviewCount: 92,
			imageSrc: '/images/products/biology-cards.jpg',
			subject: 'Биология',
			grade: '7-8 класс',
			card_type: 'Вопрос-ответ',
			quantity: 5,
			number_of_cards: 45,
			label: null,
		},
	]

	// Фильтруем, чтобы исключить текущий товар
	return mockProducts.filter((product) => product.slug !== currentProductSlug)
}

export default function PopularProducts({ currentProductSlug }) {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadProducts = async () => {
			setLoading(true)
			try {
				const data = await fetchPopularProducts(currentProductSlug)
				setProducts(data)
			} catch (error) {
				console.error('Ошибка при загрузке популярных товаров:', error)
			} finally {
				setLoading(false)
			}
		}

		loadProducts()
	}, [currentProductSlug])

	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow-sm p-6 my-8">
				<h2 className="text-2xl font-bold mb-6">Популярные товары</h2>
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary-blue"></div>
				</div>
			</div>
		)
	}

	if (products.length === 0) {
		return null
	}

	return (
		<div className="bg-white rounded-lg shadow-sm p-6 my-8">
			<h2 className="text-2xl font-bold mb-6">Популярные товары</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} variant="catalog" />
				))}
			</div>
		</div>
	)
}
