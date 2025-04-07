import ProductCard from '@/components/ProductCard'

export default function Page() {
	const product = {
		id: 1,
		name: 'Карточки по биологии 5-11 класс',
		price: 890,
		oldPrice: 1190,
		rating: 4.8,
		reviewCount: 124,
		imageSrc: '/images/products/math-cards.jpg',
		label: 'Хит продаж',
	}
	return (
		<div>
			<div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
				<ProductCard product={product}></ProductCard>
				<ProductCard product={product}></ProductCard>
				<ProductCard product={product}></ProductCard>
			</div>
		</div>
	)
}
