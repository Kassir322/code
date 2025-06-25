/** @type {import('next').NextConfig} */
const nextConfig = {
	compress: true,
	poweredByHeader: false,
	productionBrowserSourceMaps: false,
	skipMiddlewareUrlNormalize: true,
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*.mat-focus.ru',
			},
			{
				protocol: 'https',
				hostname: '*.mat-focus-shop.ru',
			},
		],
	},
	env: {
		STRAPI_API_URL: process.env.STRAPI_API_URL,
		STRAPI_API_KEY: process.env.STRAPI_API_KEY,
	},
}

export default nextConfig
