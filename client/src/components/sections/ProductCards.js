import React from 'react'
import ProductCard from '@/components/ProductCard'

export default function ProductCards({ products }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-30 lg:gap-x-20 gap-y-5 max-h-[600px] ">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	)
}
