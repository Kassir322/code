// src/components/product/SimilarProducts.js
'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'

// Функция для получения похожих товаров (из той же категории)
const fetchSimilarProducts = async (currentProductSlug, category) => {
	// В реальном приложении здесь будет запрос к API
	// const response = await fetch(`/api/products/similar?category=${category}&exclude=${currentProductSlug}`);
	// return await response.json();

	// Импортируем моковые данные
	const productMockData = (await import('@/lib/mock-data')).default

	// Фильтруем товары, которые:
	// 1. Относятся к той же категории (предмету)
	// 2. Имеют другой slug (не текущий товар)
	const filteredProducts = productMockData.filter(
		(product) =>
			product.subject?.toLowerCase() === category?.toLowerCase() &&
			product.slug !== currentProductSlug
	)

	// Возвращаем максимум 4 товара
	return filteredProducts.slice(0, 4)
}

export default function SimilarProducts({ currentProductSlug, category }) {
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const loadProducts = async () => {
			setLoading(true)
			try {
				const data = await fetchSimilarProducts(currentProductSlug, category)
				setProducts(data)
			} catch (error) {
				console.error('Ошибка при загрузке похожих товаров:', error)
			} finally {
				setLoading(false)
			}
		}

		if (category) {
			loadProducts()
		}
	}, [currentProductSlug, category])

	if (loading) {
		return (
			<div className="bg-white rounded-lg shadow-sm p-6 my-8">
				<h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
				<div className="flex justify-center py-8">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary-blue"></div>
				</div>
			</div>
		)
	}

	// Если нет товаров или менее 2-х товаров, не показываем раздел
	if (products.length < 2) {
		return null
	}

	return (
		<div className="bg-white rounded-lg shadow-sm p-6 my-8">
			<h2 className="text-2xl font-bold mb-6">Похожие товары</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} variant="catalog" />
				))}
			</div>
		</div>
	)
}
