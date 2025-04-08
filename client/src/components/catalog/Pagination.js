// src/components/catalog/Pagination.js
'use client'

export default function Pagination({ currentPage, totalPages, onChangePage }) {
	const renderPaginationButtons = () => {
		const buttons = []

		// Кнопка "Предыдущая страница"
		buttons.push(
			<button
				key="prev"
				onClick={() => onChangePage(Math.max(currentPage - 1, 1))}
				disabled={currentPage === 1}
				className="px-3 py-1 rounded border border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-neutral-02"
				aria-label="Предыдущая страница"
			>
				←
			</button>
		)

		// Номера страниц с логикой для отображения только части номеров при большом количестве страниц
		const showEllipsis = totalPages > 7

		if (showEllipsis) {
			// Всегда показываем первую страницу
			buttons.push(
				<button
					key={1}
					onClick={() => onChangePage(1)}
					className={`px-3 py-1 rounded ${
						currentPage === 1
							? 'bg-secondary-blue text-white'
							: 'border border-gray-300 hover:bg-neutral-02'
					}`}
				>
					1
				</button>
			)

			// Показываем многоточие в начале, если текущая страница далеко от первой
			if (currentPage > 3) {
				buttons.push(
					<span key="ellipsis1" className="px-2">
						...
					</span>
				)
			}

			// Отображаем страницы до и после текущей
			for (
				let i = Math.max(2, currentPage - 1);
				i <= Math.min(totalPages - 1, currentPage + 1);
				i++
			) {
				buttons.push(
					<button
						key={i}
						onClick={() => onChangePage(i)}
						className={`px-3 py-1 rounded ${
							currentPage === i
								? 'bg-secondary-blue text-white'
								: 'border border-gray-300 hover:bg-neutral-02'
						}`}
					>
						{i}
					</button>
				)
			}

			// Показываем многоточие в конце, если текущая страница далеко от последней
			if (currentPage < totalPages - 2) {
				buttons.push(
					<span key="ellipsis2" className="px-2">
						...
					</span>
				)
			}

			// Всегда показываем последнюю страницу, если страниц больше 1
			if (totalPages > 1) {
				buttons.push(
					<button
						key={totalPages}
						onClick={() => onChangePage(totalPages)}
						className={`px-3 py-1 rounded ${
							currentPage === totalPages
								? 'bg-secondary-blue text-white'
								: 'border border-gray-300 hover:bg-neutral-02'
						}`}
					>
						{totalPages}
					</button>
				)
			}
		} else {
			// Если страниц немного, показываем все
			for (let i = 1; i <= totalPages; i++) {
				buttons.push(
					<button
						key={i}
						onClick={() => onChangePage(i)}
						className={`px-3 py-1 rounded ${
							currentPage === i
								? 'bg-secondary-blue text-white'
								: 'border border-gray-300 hover:bg-neutral-02'
						}`}
					>
						{i}
					</button>
				)
			}
		}

		// Кнопка "Следующая страница"
		buttons.push(
			<button
				key="next"
				onClick={() => onChangePage(Math.min(currentPage + 1, totalPages))}
				disabled={currentPage === totalPages}
				className="px-3 py-1 rounded border border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-neutral-02"
				aria-label="Следующая страница"
			>
				→
			</button>
		)

		return buttons
	}

	return (
		<div className="mt-8 flex justify-center space-x-2">
			{renderPaginationButtons()}
		</div>
	)
}
