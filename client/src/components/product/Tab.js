// src/components/product/Tab.js
export default function Tab({ id, label, active, onClick }) {
	return (
		<button
			id={`tab-${id}`}
			role="tab"
			aria-selected={active}
			aria-controls={`panel-${id}`}
			className={`inline-block py-4 px-6 text-sm font-medium border-b-2 rounded-t-lg ${
				active
					? 'text-secondary-blue border-secondary-blue'
					: 'text-gray-600 border-transparent hover:text-gray-700 hover:border-gray-300'
			}`}
			onClick={onClick}
		>
			{label}
		</button>
	)
}
