// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken')

/**
 * Middleware для проверки аутентификации пользователя
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports = (req, res, next) => {
	try {
		// Получение токена из заголовка Authorization
		const authHeader = req.headers.authorization
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ message: 'Требуется авторизация' })
		}

		// Извлечение и проверка токена
		const token = authHeader.split(' ')[1]
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET || 'your-secret-key'
		)

		// Добавление данных пользователя в объект запроса
		req.user = decoded

		// Продолжение выполнения запроса
		next()
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ message: 'Срок действия токена истек' })
		}
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ message: 'Недействительный токен' })
		}

		console.error('Ошибка авторизации:', error)
		return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
	}
}
