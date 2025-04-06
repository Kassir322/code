/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
const { fontFamilty } = require('tailwindcss/defaulTheme')
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		fontFamily: {
			sans: ['Roboto', 'sans-serif'],
		},
	},
	plugins: [require('tailgrids/plugin')],
}
