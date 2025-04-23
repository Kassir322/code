export const formatPrice = (price) => {
	if (typeof price !== 'number') return '0'
	return price.toLocaleString('ru-RU', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	})
}
