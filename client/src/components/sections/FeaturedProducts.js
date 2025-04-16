import React from 'react'
import ProductCards from '@/components/sections/ProductCards'

export default function FeaturedProducts({ products }) {
	return (
		<section className="py-16 bg-gray-50">
			<div className="container mx-auto px-4">
				<h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
					Лучшие предложения
				</h2>
				<ProductCards products={products} />
			</div>
		</section>
	)
}
