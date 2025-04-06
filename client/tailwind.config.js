/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#39478E', // Основной синий цвет из логотипа
				'primary-dark': '#2B3A7C', // Темный вариант синего
				'primary-light': '#DEEAF4', // Светлый вариант синего
				secondary: '#6796CC', // Светло-синий цвет из логотипа
				'secondary-dark': '#5884B8', // Темный вариант светло-синего
				accent: '#4caf50', // Зеленый акцент для кнопок или выделения
			},
		},
	},
	plugins: [],
}
