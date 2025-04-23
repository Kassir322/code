/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		STRAPI_API_URL: process.env.STRAPI_API_URL,
		STRAPI_API_KEY: process.env.STRAPI_API_KEY,
	},
}

export default nextConfig
