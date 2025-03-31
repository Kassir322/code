// controllers/UserController.js
const db = require('../db')
const { User } = db // Импортируем модель User из инициализированного db
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserController {
	/**
	 * Получение списка всех пользователей
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getAllUsers(req, res) {
		try {
			// Проверка прав доступа (только администраторы могут видеть всех пользователей)
			if (!req.user || !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			const users = await User.findAll({
				attributes: { exclude: ['password'] }, // Исключаем пароль из результатов
			})

			return res.status(200).json(users)
		} catch (error) {
			console.error('Ошибка при получении пользователей:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение пользователя по ID
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getUserById(req, res) {
		try {
			const { id } = req.params

			// Проверка прав доступа (пользователь может видеть только свой профиль или админ может видеть любой)
			if (
				!req.user ||
				(req.user.id !== parseInt(id) && !req.user.roles.includes('admin'))
			) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			const user = await User.findByPk(id, {
				attributes: { exclude: ['password'] }, // Исключаем пароль из результатов
			})

			if (!user) {
				return res.status(404).json({ message: 'Пользователь не найден' })
			}

			return res.status(200).json(user)
		} catch (error) {
			console.error('Ошибка при получении пользователя:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Создание нового пользователя (регистрация)
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async createUser(req, res) {
		try {
			const { name, email, password, phone } = req.body

			// Проверка обязательных полей
			if (!name || !email || !password) {
				return res
					.status(400)
					.json({ message: 'Необходимо указать имя, email и пароль' })
			}

			// Проверка, существует ли пользователь с таким email
			const existingUser = await User.findOne({ where: { email } })
			if (existingUser) {
				return res
					.status(400)
					.json({ message: 'Пользователь с таким email уже существует' })
			}

			// Хеширование пароля
			const hashedPassword = await bcrypt.hash(password, 10)

			// Создание пользователя
			const user = await User.create({
				name,
				email,
				password: hashedPassword,
				phone: phone || null,
				roles: ['customer'], // По умолчанию роль - покупатель
			})

			// Исключаем пароль из ответа
			const userResponse = {
				id: user.id,
				name: user.name,
				email: user.email,
				roles: user.roles,
				phone: user.phone,
				created_at: user.created_at,
			}

			return res.status(201).json(userResponse)
		} catch (error) {
			console.error('Ошибка при создании пользователя:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Авторизация пользователя
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async loginUser(req, res) {
		try {
			const { email, password } = req.body

			// Проверка обязательных полей
			if (!email || !password) {
				return res
					.status(400)
					.json({ message: 'Необходимо указать email и пароль' })
			}

			// Поиск пользователя по email
			const user = await User.findOne({ where: { email } })
			if (!user) {
				return res.status(401).json({ message: 'Неверный email или пароль' })
			}

			// Проверка пароля
			const passwordMatch = await bcrypt.compare(password, user.password)
			if (!passwordMatch) {
				return res.status(401).json({ message: 'Неверный email или пароль' })
			}

			// Создание JWT токена
			const token = jwt.sign(
				{
					id: user.id,
					email: user.email,
					roles: user.roles,
				},
				process.env.JWT_SECRET || 'your-secret-key',
				{ expiresIn: '24h' }
			)

			// Исключаем пароль из ответа
			const userResponse = {
				id: user.id,
				name: user.name,
				email: user.email,
				roles: user.roles,
				phone: user.phone,
			}

			return res.status(200).json({
				user: userResponse,
				token,
			})
		} catch (error) {
			console.error('Ошибка при авторизации пользователя:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Обновление данных пользователя
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async updateUser(req, res) {
		try {
			const { id } = req.params
			const { name, email, phone, currentPassword, newPassword } = req.body

			// Проверка прав доступа (пользователь может обновлять только свой профиль или админ может обновлять любой)
			if (
				!req.user ||
				(req.user.id !== parseInt(id) && !req.user.roles.includes('admin'))
			) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			// Получение пользователя
			const user = await User.findByPk(id)
			if (!user) {
				return res.status(404).json({ message: 'Пользователь не найден' })
			}

			// Обновление данных
			if (name) user.name = name
			if (email && email !== user.email) {
				// Проверка, не занят ли новый email
				const existingUser = await User.findOne({ where: { email } })
				if (existingUser && existingUser.id !== parseInt(id)) {
					return res
						.status(400)
						.json({ message: 'Пользователь с таким email уже существует' })
				}
				user.email = email
			}
			if (phone !== undefined) user.phone = phone

			// Обновление пароля, если предоставлен текущий и новый пароль
			if (currentPassword && newPassword) {
				// Проверка текущего пароля
				const passwordMatch = await bcrypt.compare(
					currentPassword,
					user.password
				)
				if (!passwordMatch) {
					return res.status(401).json({ message: 'Неверный текущий пароль' })
				}

				// Хеширование нового пароля
				user.password = await bcrypt.hash(newPassword, 10)
			}

			// Сохранение обновленных данных
			await user.save()

			// Исключаем пароль из ответа
			const userResponse = {
				id: user.id,
				name: user.name,
				email: user.email,
				roles: user.roles,
				phone: user.phone,
				updated_at: user.updated_at,
			}

			return res.status(200).json(userResponse)
		} catch (error) {
			console.error('Ошибка при обновлении пользователя:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Удаление пользователя
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async deleteUser(req, res) {
		try {
			const { id } = req.params

			// Проверка прав доступа (только администраторы могут удалять пользователей)
			// или пользователь удаляет свой аккаунт
			if (
				!req.user ||
				(req.user.id !== parseInt(id) && !req.user.roles.includes('admin'))
			) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			// Получение пользователя
			const user = await User.findByPk(id)
			if (!user) {
				return res.status(404).json({ message: 'Пользователь не найден' })
			}

			// Удаление пользователя
			await user.destroy()

			return res.status(200).json({ message: 'Пользователь успешно удален' })
		} catch (error) {
			console.error('Ошибка при удалении пользователя:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение профиля текущего авторизованного пользователя
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getCurrentUser(req, res) {
		try {
			if (!req.user) {
				return res.status(401).json({ message: 'Не авторизован' })
			}

			const user = await User.findByPk(req.user.id, {
				attributes: { exclude: ['password'] }, // Исключаем пароль из результатов
			})

			if (!user) {
				return res.status(404).json({ message: 'Пользователь не найден' })
			}

			return res.status(200).json(user)
		} catch (error) {
			console.error('Ошибка при получении профиля:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Изменение роли пользователя (только для администраторов)
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async updateUserRole(req, res) {
		try {
			const { id } = req.params
			const { roles } = req.body

			// Проверка прав доступа (только администраторы могут изменять роли)
			if (!req.user || !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			// Проверка наличия ролей
			if (!roles || !Array.isArray(roles)) {
				return res
					.status(400)
					.json({ message: 'Необходимо указать массив ролей' })
			}

			// Получение пользователя
			const user = await User.findByPk(id)
			if (!user) {
				return res.status(404).json({ message: 'Пользователь не найден' })
			}

			// Обновление ролей
			user.roles = roles
			await user.save()

			// Исключаем пароль из ответа
			const userResponse = {
				id: user.id,
				name: user.name,
				email: user.email,
				roles: user.roles,
				phone: user.phone,
				updated_at: user.updated_at,
			}

			return res.status(200).json(userResponse)
		} catch (error) {
			console.error('Ошибка при обновлении ролей пользователя:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}
}

module.exports = new UserController()
