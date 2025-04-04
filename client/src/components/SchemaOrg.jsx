/**
 * Компонент для внедрения Schema.org разметки в страницы
 * @param {Object} data - Объект с данными Schema.org
 * @returns {JSX.Element} - Script элемент с JSON-LD
 */
export default function SchemaOrg({ data }) {
	// Если передан массив схем, конвертируем каждую в строку и объединяем
	if (Array.isArray(data)) {
		return (
			<>
				{data.map((item, index) => (
					<script
						key={index}
						type="application/ld+json"
						dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
					/>
				))}
			</>
		)
	}

	// Если передана одиночная схема
	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
		/>
	)
}
