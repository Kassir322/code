// controllers/ReviewController.js
const db = require('../db')
const { Review, User, StudyCard } = db

class ReviewController {
	/**
	 * Получение всех отзывов для учебной карточки
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getStudyCardReviews(req, res) {
		try {
			const { studyCardId } = req.params
			const { page = 1, limit = 10 } = req.query

			const offset = (page - 1) * limit

			// Проверяем, существует ли учебная карточка
			const studyCard = await StudyCard.findByPk(studyCardId)
			if (!studyCard) {
				return res.status(404).json({ message: 'Учебная карточка не найдена' })
			}

			// Получаем отзывы с пагинацией
			const { count, rows: reviews } = await Review.findAndCountAll({
				where: { study_card_id: studyCardId },
				include: [
					{
						model: User,
						as: 'user',
						attributes: ['id', 'name'],
					},
				],
				limit: parseInt(limit),
				offset: parseInt(offset),
				order: [['created_at', 'DESC']],
			})

			return res.status(200).json({
				total: count,
				totalPages: Math.ceil(count / limit),
				currentPage: parseInt(page),
				reviews,
			})
		} catch (error) {
			console.error('Ошибка при получении отзывов:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение отзыва по ID
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getReviewById(req, res) {
		try {
			const { id } = req.params

			const review = await Review.findByPk(id, {
				include: [
					{
						model: User,
						as: 'user',
						attributes: ['id', 'name'],
					},
					{
						model: StudyCard,
						as: 'studyCard',
						attributes: ['id', 'title', 'image_url'],
					},
				],
			})

			if (!review) {
				return res.status(404).json({ message: 'Отзыв не найден' })
			}

			return res.status(200).json(review)
		} catch (error) {
			console.error('Ошибка при получении отзыва:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Создание нового отзыва
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async createReview(req, res) {
		try {
			// Проверка авторизации
			if (!req.user) {
				return res.status(401).json({ message: 'Необходима авторизация' })
			}

			const { study_card_id, rating, comment } = req.body
			const user_id = req.user.id

			// Проверка обязательных полей
			if (!study_card_id || !rating) {
				return res
					.status(400)
					.json({ message: 'Необходимо указать ID товара и рейтинг' })
			}

			// Проверка, существует ли учебная карточка
			const studyCard = await StudyCard.findByPk(study_card_id)
			if (!studyCard) {
				return res.status(404).json({ message: 'Учебная карточка не найдена' })
			}

			// Проверка, не оставлял ли пользователь уже отзыв на эту карточку
			const existingReview = await Review.findOne({
				where: {
					study_card_id,
					user_id,
				},
			})

			if (existingReview) {
				return res
					.status(400)
					.json({ message: 'Вы уже оставили отзыв на этот товар' })
			}

			// Создание отзыва
			const review = await Review.create({
				study_card_id,
				user_id,
				rating,
				comment: comment || null,
			})

			// Получаем созданный отзыв с информацией о пользователе
			const createdReview = await Review.findByPk(review.id, {
				include: [
					{
						model: User,
						as: 'user',
						attributes: ['id', 'name'],
					},
				],
			})

			return res.status(201).json(createdReview)
		} catch (error) {
			console.error('Ошибка при создании отзыва:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Обновление отзыва
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async updateReview(req, res) {
		try {
			// Проверка авторизации
			if (!req.user) {
				return res.status(401).json({ message: 'Необходима авторизация' })
			}

			const { id } = req.params
			const { rating, comment } = req.body
			const userId = req.user.id

			// Получение отзыва
			const review = await Review.findByPk(id)
			if (!review) {
				return res.status(404).json({ message: 'Отзыв не найден' })
			}

			// Проверка прав доступа (пользователь может обновлять только свои отзывы или админ может обновлять любые)
			if (review.user_id !== userId && !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			// Обновление данных
			if (rating) review.rating = rating
			if (comment !== undefined) review.comment = comment

			// Сохранение обновленных данных
			await review.save()

			// Получаем обновленный отзыв с информацией о пользователе
			const updatedReview = await Review.findByPk(review.id, {
				include: [
					{
						model: User,
						as: 'user',
						attributes: ['id', 'name'],
					},
				],
			})

			return res.status(200).json(updatedReview)
		} catch (error) {
			console.error('Ошибка при обновлении отзыва:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Удаление отзыва
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async deleteReview(req, res) {
		try {
			// Проверка авторизации
			if (!req.user) {
				return res.status(401).json({ message: 'Необходима авторизация' })
			}

			const { id } = req.params
			const userId = req.user.id

			// Получение отзыва
			const review = await Review.findByPk(id)
			if (!review) {
				return res.status(404).json({ message: 'Отзыв не найден' })
			}

			// Проверка прав доступа (пользователь может удалять только свои отзывы или админ может удалять любые)
			if (review.user_id !== userId && !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			// Удаление отзыва
			await review.destroy()

			return res.status(200).json({ message: 'Отзыв успешно удален' })
		} catch (error) {
			console.error('Ошибка при удалении отзыва:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение всех отзывов пользователя
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getUserReviews(req, res) {
		try {
			// Проверка авторизации
			if (!req.user) {
				return res.status(401).json({ message: 'Необходима авторизация' })
			}

			const userId = req.user.id
			const { page = 1, limit = 10 } = req.query

			const offset = (page - 1) * limit

			// Получаем отзывы пользователя с пагинацией
			const { count, rows: reviews } = await Review.findAndCountAll({
				where: { user_id: userId },
				include: [
					{
						model: StudyCard,
						as: 'studyCard',
						attributes: ['id', 'title', 'image_url'],
					},
				],
				limit: parseInt(limit),
				offset: parseInt(offset),
				order: [['created_at', 'DESC']],
			})

			return res.status(200).json({
				total: count,
				totalPages: Math.ceil(count / limit),
				currentPage: parseInt(page),
				reviews,
			})
		} catch (error) {
			console.error('Ошибка при получении отзывов пользователя:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}
}

module.exports = new ReviewController()
