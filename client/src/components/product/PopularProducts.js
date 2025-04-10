'use client'
// src/components/product/PopularProducts.js (обновленная версия)
import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'

// Функция-заглушка для получения популярных товаров
const fetchPopularProducts = async (currentProductSlug) => {
	// В реальном приложении здесь будет запрос к API
	// const response = await fetch(`/api/products/popular?exclude=${currentProductSlug}`);
	// return await response.json();

	// Импортируем моковые данные из общего файла
	const productMockData = (await import('@/lib/mock-data')).default

	// Фильтруем, чтобы исключить текущий товар по slug
	return productMockData
		.filter((product) => product.slug !== currentProductSlug)
		.slice(0, 4) // Только первые 4 товара для популярных
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

	// Проверяем количество товаров - если их меньше 2, не показываем раздел
	if (products.length < 2) {
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
