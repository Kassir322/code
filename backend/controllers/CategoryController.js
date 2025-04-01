// controllers/CategoryController.js
const db = require('../db')
const { Category, StudyCard } = db

class CategoryController {
	/**
	 * Получение списка всех категорий
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getAllCategories(req, res) {
		try {
			const categories = await Category.findAll({
				where: {
					is_active: true,
				},
			})

			return res.status(200).json(categories)
		} catch (error) {
			console.error('Ошибка при получении категорий:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение категории по ID
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getCategoryById(req, res) {
		try {
			const { id } = req.params

			const category = await Category.findByPk(id)

			if (!category) {
				return res.status(404).json({ message: 'Категория не найдена' })
			}

			return res.status(200).json(category)
		} catch (error) {
			console.error('Ошибка при получении категории:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение категории по slug
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getCategoryBySlug(req, res) {
		try {
			const { slug } = req.params

			const category = await Category.findOne({
				where: { slug },
			})

			if (!category) {
				return res.status(404).json({ message: 'Категория не найдена' })
			}

			return res.status(200).json(category)
		} catch (error) {
			console.error('Ошибка при получении категории по slug:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение товаров в категории по ID категории
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getCategoryProducts(req, res) {
		try {
			const { id } = req.params
			const { page = 1, limit = 10 } = req.query

			const offset = (page - 1) * limit

			// Проверяем, существует ли категория
			const category = await Category.findByPk(id)
			if (!category) {
				return res.status(404).json({ message: 'Категория не найдена' })
			}

			// Получаем товары категории с пагинацией
			const { count, rows: studyCards } = await StudyCard.findAndCountAll({
				where: {
					category_id: id,
					is_active: true,
				},
				limit: parseInt(limit),
				offset: parseInt(offset),
				order: [['created_at', 'DESC']],
			})

			return res.status(200).json({
				total: count,
				totalPages: Math.ceil(count / limit),
				currentPage: parseInt(page),
				studyCards,
			})
		} catch (error) {
			console.error('Ошибка при получении товаров категории:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Создание новой категории
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async createCategory(req, res) {
		try {
			// Проверка прав доступа (только администраторы могут создавать категории)
			if (!req.user || !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			const { name, slug, description, is_active } = req.body

			// Проверка обязательных полей
			if (!name) {
				return res
					.status(400)
					.json({ message: 'Необходимо указать название категории' })
			}

			// Проверка, существует ли категория с таким slug
			if (slug) {
				const existingCategory = await Category.findOne({ where: { slug } })
				if (existingCategory) {
					return res
						.status(400)
						.json({ message: 'Категория с таким slug уже существует' })
				}
			}

			// Создание категории
			const category = await Category.create({
				name,
				slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
				description: description || null,
				is_active: is_active !== undefined ? is_active : true,
			})

			return res.status(201).json(category)
		} catch (error) {
			console.error('Ошибка при создании категории:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Обновление категории
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async updateCategory(req, res) {
		try {
			// Проверка прав доступа (только администраторы могут обновлять категории)
			if (!req.user || !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			const { id } = req.params
			const { name, slug, description, is_active } = req.body

			// Получение категории
			const category = await Category.findByPk(id)
			if (!category) {
				return res.status(404).json({ message: 'Категория не найдена' })
			}

			// Проверка, не занят ли новый slug
			if (slug && slug !== category.slug) {
				const existingCategory = await Category.findOne({ where: { slug } })
				if (existingCategory && existingCategory.id !== parseInt(id)) {
					return res
						.status(400)
						.json({ message: 'Категория с таким slug уже существует' })
				}
			}

			// Обновление данных
			if (name) category.name = name
			if (slug) category.slug = slug
			if (description !== undefined) category.description = description
			if (is_active !== undefined) category.is_active = is_active

			// Сохранение обновленных данных
			await category.save()

			return res.status(200).json(category)
		} catch (error) {
			console.error('Ошибка при обновлении категории:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Удаление категории
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async deleteCategory(req, res) {
		try {
			// Проверка прав доступа (только администраторы могут удалять категории)
			if (!req.user || !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			const { id } = req.params

			// Получение категории
			const category = await Category.findByPk(id)
			if (!category) {
				return res.status(404).json({ message: 'Категория не найдена' })
			}

			// Проверка, есть ли товары в этой категории
			const productsCount = await StudyCard.count({
				where: { category_id: id },
			})

			if (productsCount > 0) {
				// Вместо удаления просто делаем категорию неактивной
				category.is_active = false
				await category.save()
				return res.status(200).json({
					message: 'Категория содержит товары и была деактивирована',
					deactivated: true,
				})
			}

			// Если товаров нет, удаляем категорию
			await category.destroy()

			return res.status(200).json({ message: 'Категория успешно удалена' })
		} catch (error) {
			console.error('Ошибка при удалении категории:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}
}

module.exports = new CategoryController()
