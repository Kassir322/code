module.exports = [
	'strapi::logger',
	'strapi::errors',
	'strapi::security',
	'strapi::cors',
	'strapi::poweredBy',
	'strapi::query',
	'strapi::body',
	'strapi::session',
	'strapi::favicon',
	'strapi::public',
]

module.exports.settings = {
	rateLimit: {
		enabled: true,
		interval: 60000,
		max: 1000, // максимум 100 запросов в минуту
	},
}
