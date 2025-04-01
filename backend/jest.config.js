module.exports = {
	// Устанавливаем окружение для тестов
	testEnvironment: 'node',

	// Устанавливаем переменную окружения для тестов
	setupFiles: ['<rootDir>/tests/env-setup.js'],

	// Таймаут для тестов
	testTimeout: 30000,

	// Остальные настройки делаем минимальными для старта
	verbose: true,
}
