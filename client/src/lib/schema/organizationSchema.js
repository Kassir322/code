// lib/schema/organizationSchema.js

/**
 * Генерирует Schema.org разметку для организации
 * @returns {Object} - Объект Schema.org для организации
 */
export function generateOrganizationSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: 'mat-focus',
		url: 'https://mat-focus.ru',
		telephone: '+7 988 866 12 76',
		email: 'control@mat-focus.ru',
		sameAs: ['https://t.me/matfocus'],
		contactPoint: {
			'@type': 'ContactPoint',
			telephone: '+7 988 866 12 76',
			contactType: 'customer service',
			availableLanguage: 'Russian',
		},
	}
}
