// controllers/StudyCardController.js
const db = require('../db')
const { StudyCard, Category, Review, User } = db
const { Op } = require('sequelize')

class StudyCardController {
	/**
	 * Получение списка всех учебных карточек с пагинацией
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getAllStudyCards(req, res) {
		try {
			const {
				page = 1,
				limit = 10,
				sort = 'created_at',
				order = 'DESC',
				subject,
				min_price,
				max_price,
				school_grades,
				card_type,
				category_id,
				search,
			} = req.query

			const offset = (page - 1) * limit

			// Формируем условия фильтрации
			const whereConditions = { is_active: true }

			// Поиск по названию
			if (search) {
				whereConditions.title = {
					[Op.iLike]: `%${search}%`,
				}
			}

			// Фильтрация по категории
			if (category_id) {
				whereConditions.category_id = category_id
			}

			// Фильтрация по предмету
			if (subject) {
				whereConditions.subject = subject
			}

			// Фильтрация по типу карточек
			if (card_type) {
				whereConditions.card_type = card_type
			}

			// Фильтрация по ценовому диапазону
			if (min_price || max_price) {
				whereConditions.price = {}

				if (min_price) {
					whereConditions.price[Op.gte] = min_price
				}

				if (max_price) {
					whereConditions.price[Op.lte] = max_price
				}
			}

			// Фильтрация по классам
			if (school_grades) {
				const grades = Array.isArray(school_grades)
					? school_grades
					: [school_grades]

				whereConditions.school_grades = {
					[Op.overlap]: grades.map((grade) => parseInt(grade)),
				}
			}

			// Определяем порядок сортировки
			const sortOrder = [[sort, order]]

			// Получаем товары с пагинацией
			const { count, rows: studyCards } = await StudyCard.findAndCountAll({
				where: whereConditions,
				include: [
					{
						model: Category,
						as: 'category',
						attributes: ['id', 'name', 'slug'],
					},
				],
				limit: parseInt(limit),
				offset: parseInt(offset),
				order: sortOrder,
			})

			return res.status(200).json({
				total: count,
				totalPages: Math.ceil(count / limit),
				currentPage: parseInt(page),
				studyCards,
			})
		} catch (error) {
			console.error('Ошибка при получении учебных карточек:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение учебной карточки по ID
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getStudyCardById(req, res) {
		try {
			const { id } = req.params

			const studyCard = await StudyCard.findByPk(id, {
				include: [
					{
						model: Category,
						as: 'category',
						attributes: ['id', 'name', 'slug'],
					},
					{
						model: Review,
						as: 'reviews',
						include: [
							{
								model: User,
								as: 'user',
								attributes: ['id', 'name'],
							},
						],
					},
				],
			})

			if (!studyCard) {
				return res.status(404).json({ message: 'Учебная карточка не найдена' })
			}

			return res.status(200).json(studyCard)
		} catch (error) {
			console.error('Ошибка при получении учебной карточки:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Создание новой учебной карточки
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async createStudyCard(req, res) {
		try {
			// Проверка прав доступа (только администраторы могут создавать карточки)
			if (!req.user || !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			const {
				title,
				description,
				price,
				quantity,
				image_url,
				subject,
				school_grades,
				card_type,
				number_of_cards,
				category_id,
				is_active,
			} = req.body

			// Проверка обязательных полей
			if (!title || !price || !category_id) {
				return res.status(400).json({
					message:
						'Необходимо указать название, цену и категорию учебной карточки',
				})
			}

			// Проверка, существует ли категория
			const category = await Category.findByPk(category_id)
			if (!category) {
				return res
					.status(400)
					.json({ message: 'Указанная категория не существует' })
			}

			// Создание учебной карточки
			const studyCard = await StudyCard.create({
				title,
				description,
				price,
				quantity: quantity || 0,
				image_url,
				subject,
				school_grades: school_grades || [],
				card_type,
				number_of_cards,
				category_id,
				is_active: is_active !== undefined ? is_active : true,
			})

			return res.status(201).json(studyCard)
		} catch (error) {
			console.error('Ошибка при создании учебной карточки:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Обновление учебной карточки
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async updateStudyCard(req, res) {
		try {
			// Проверка прав доступа (только администраторы могут обновлять карточки)
			if (!req.user || !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			const { id } = req.params
			const {
				title,
				description,
				price,
				quantity,
				image_url,
				subject,
				school_grades,
				card_type,
				number_of_cards,
				category_id,
				is_active,
			} = req.body

			// Получение учебной карточки
			const studyCard = await StudyCard.findByPk(id)
			if (!studyCard) {
				return res.status(404).json({ message: 'Учебная карточка не найдена' })
			}

			// Проверка, существует ли новая категория, если она была изменена
			if (category_id && category_id !== studyCard.category_id) {
				const category = await Category.findByPk(category_id)
				if (!category) {
					return res
						.status(400)
						.json({ message: 'Указанная категория не существует' })
				}
			}

			// Обновление данных
			if (title) studyCard.title = title
			if (description !== undefined) studyCard.description = description
			if (price) studyCard.price = price
			if (quantity !== undefined) studyCard.quantity = quantity
			if (image_url !== undefined) studyCard.image_url = image_url
			if (subject !== undefined) studyCard.subject = subject
			if (school_grades) studyCard.school_grades = school_grades
			if (card_type !== undefined) studyCard.card_type = card_type
			if (number_of_cards !== undefined)
				studyCard.number_of_cards = number_of_cards
			if (category_id) studyCard.category_id = category_id
			if (is_active !== undefined) studyCard.is_active = is_active

			// Сохранение обновленных данных
			await studyCard.save()

			return res.status(200).json(studyCard)
		} catch (error) {
			console.error('Ошибка при обновлении учебной карточки:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Удаление учебной карточки
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async deleteStudyCard(req, res) {
		try {
			// Проверка прав доступа (только администраторы могут удалять карточки)
			if (!req.user || !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			const { id } = req.params

			// Получение учебной карточки
			const studyCard = await StudyCard.findByPk(id)
			if (!studyCard) {
				return res.status(404).json({ message: 'Учебная карточка не найдена' })
			}

			// Удаление учебной карточки
			await studyCard.destroy()

			return res
				.status(200)
				.json({ message: 'Учебная карточка успешно удалена' })
		} catch (error) {
			console.error('Ошибка при удалении учебной карточки:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение списка доступных предметов
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getSubjects(req, res) {
		try {
			const subjects = await StudyCard.findAll({
				attributes: [
					[db.sequelize.fn('DISTINCT', db.sequelize.col('subject')), 'subject'],
				],
				where: {
					subject: {
						[Op.ne]: null,
					},
					is_active: true,
				},
			})

			return res.status(200).json(subjects.map((item) => item.subject))
		} catch (error) {
			console.error('Ошибка при получении списка предметов:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение списка типов карточек
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getCardTypes(req, res) {
		try {
			const cardTypes = await StudyCard.findAll({
				attributes: [
					[
						db.sequelize.fn('DISTINCT', db.sequelize.col('card_type')),
						'card_type',
					],
				],
				where: {
					card_type: {
						[Op.ne]: null,
					},
					is_active: true,
				},
			})

			return res.status(200).json(cardTypes.map((item) => item.card_type))
		} catch (error) {
			console.error('Ошибка при получении списка типов карточек:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение диапазона классов
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getSchoolGrades(req, res) {
		try {
			// Этот метод более сложный, так как school_grades - массив
			// Поэтому сначала получаем все уникальные карточки
			const studyCards = await StudyCard.findAll({
				attributes: ['school_grades'],
				where: {
					school_grades: {
						[Op.ne]: null,
					},
					is_active: true,
				},
			})

			// Затем извлекаем все уникальные значения школьных классов
			const allGrades = studyCards.reduce((acc, card) => {
				if (card.school_grades && card.school_grades.length > 0) {
					card.school_grades.forEach((grade) => {
						if (!acc.includes(grade)) {
							acc.push(grade)
						}
					})
				}
				return acc
			}, [])

			// Сортируем по возрастанию
			allGrades.sort((a, b) => a - b)

			return res.status(200).json(allGrades)
		} catch (error) {
			console.error('Ошибка при получении списка классов:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}
}

module.exports = new StudyCardController()
