// controllers/OrderController.js
const db = require('../db')
const { Order, OrderItem, StudyCard, User } = db
const { Op } = require('sequelize')

class OrderController {
	/**
	 * Получение списка всех заказов (доступно только для администраторов)
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getAllOrders(req, res) {
		try {
			// Проверка прав доступа (только администраторы могут видеть все заказы)
			if (!req.user || !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			const {
				page = 1,
				limit = 10,
				status,
				start_date,
				end_date,
				sort = 'created_at',
				order = 'DESC',
			} = req.query

			const offset = (page - 1) * limit

			// Формируем условия фильтрации
			const whereConditions = {}

			// Фильтрация по статусу
			if (status) {
				whereConditions.status = status
			}

			// Фильтрация по диапазону дат
			if (start_date || end_date) {
				whereConditions.created_at = {}

				if (start_date) {
					whereConditions.created_at[Op.gte] = new Date(start_date)
				}

				if (end_date) {
					// Устанавливаем конец дня для end_date
					const endDateObj = new Date(end_date)
					endDateObj.setHours(23, 59, 59, 999)
					whereConditions.created_at[Op.lte] = endDateObj
				}
			}

			// Определяем порядок сортировки
			const sortOrder = [[sort, order]]

			// Получаем заказы с пагинацией
			const { count, rows: orders } = await Order.findAndCountAll({
				where: whereConditions,
				include: [
					{
						model: User,
						as: 'user',
						attributes: ['id', 'name', 'email', 'phone'],
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
				orders,
			})
		} catch (error) {
			console.error('Ошибка при получении заказов:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение заказов текущего пользователя
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getUserOrders(req, res) {
		try {
			// Проверка авторизации
			if (!req.user) {
				return res.status(401).json({ message: 'Необходима авторизация' })
			}

			const userId = req.user.id
			const {
				page = 1,
				limit = 10,
				status,
				sort = 'created_at',
				order = 'DESC',
			} = req.query

			const offset = (page - 1) * limit

			// Формируем условия фильтрации
			const whereConditions = { user_id: userId }

			// Фильтрация по статусу
			if (status) {
				whereConditions.status = status
			}

			// Определяем порядок сортировки
			const sortOrder = [[sort, order]]

			// Получаем заказы с пагинацией
			const { count, rows: orders } = await Order.findAndCountAll({
				where: whereConditions,
				limit: parseInt(limit),
				offset: parseInt(offset),
				order: sortOrder,
			})

			return res.status(200).json({
				total: count,
				totalPages: Math.ceil(count / limit),
				currentPage: parseInt(page),
				orders,
			})
		} catch (error) {
			console.error('Ошибка при получении заказов пользователя:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение деталей заказа по ID
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getOrderById(req, res) {
		try {
			// Проверка авторизации
			if (!req.user) {
				return res.status(401).json({ message: 'Необходима авторизация' })
			}

			const { id } = req.params
			const userId = req.user.id

			// Получение заказа
			const order = await Order.findByPk(id, {
				include: [
					{
						model: OrderItem,
						as: 'orderItems',
						include: [
							{
								model: StudyCard,
								as: 'studyCard',
								attributes: [
									'id',
									'title',
									'image_url',
									'subject',
									'card_type',
								],
							},
						],
					},
					{
						model: User,
						as: 'user',
						attributes: ['id', 'name', 'email', 'phone'],
					},
				],
			})

			if (!order) {
				return res.status(404).json({ message: 'Заказ не найден' })
			}

			// Проверка прав доступа (пользователь может видеть только свои заказы или админ может видеть любые)
			if (order.user_id !== userId && !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			return res.status(200).json(order)
		} catch (error) {
			console.error('Ошибка при получении заказа:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Создание нового заказа
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async createOrder(req, res) {
		try {
			// Проверка авторизации
			if (!req.user) {
				return res.status(401).json({ message: 'Необходима авторизация' })
			}

			const userId = req.user.id
			const { items, shipping_address, payment_method, shipping_method } =
				req.body

			// Проверка обязательных полей
			if (!items || !Array.isArray(items) || items.length === 0) {
				return res
					.status(400)
					.json({ message: 'Необходимо указать товары в заказе' })
			}

			if (!shipping_address) {
				return res
					.status(400)
					.json({ message: 'Необходимо указать адрес доставки' })
			}

			if (!payment_method) {
				return res
					.status(400)
					.json({ message: 'Необходимо указать метод оплаты' })
			}

			if (!shipping_method) {
				return res
					.status(400)
					.json({ message: 'Необходимо указать метод доставки' })
			}

			// Проверка товаров и расчет общей суммы заказа
			let totalAmount = 0
			const orderItems = []

			for (const item of items) {
				if (!item.study_card_id || !item.quantity) {
					return res.status(400).json({
						message: 'Для каждого товара необходимо указать ID и количество',
					})
				}

				// Получение товара из базы данных
				const studyCard = await StudyCard.findByPk(item.study_card_id)

				if (!studyCard) {
					return res.status(404).json({
						message: `Товар с ID ${item.study_card_id} не найден`,
					})
				}

				if (!studyCard.is_active) {
					return res.status(400).json({
						message: `Товар ${studyCard.title} недоступен для заказа`,
					})
				}

				if (studyCard.quantity < item.quantity) {
					return res.status(400).json({
						message: `Недостаточное количество товара ${studyCard.title} (доступно: ${studyCard.quantity})`,
					})
				}

				// Расчет стоимости позиции и добавление в список
				const itemTotal = parseFloat(studyCard.price) * item.quantity
				totalAmount += itemTotal

				orderItems.push({
					study_card_id: studyCard.id,
					quantity: item.quantity,
					price: studyCard.price,
				})
			}

			// Создание транзакции для обеспечения целостности данных
			const result = await db.sequelize.transaction(async (t) => {
				// Создание заказа
				const order = await Order.create(
					{
						user_id: userId,
						total_amount: totalAmount,
						status: 'pending',
						shipping_address,
						payment_method,
						shipping_method,
					},
					{ transaction: t }
				)

				// Создание позиций заказа
				const createdOrderItems = await Promise.all(
					orderItems.map((item) =>
						OrderItem.create(
							{
								order_id: order.id,
								study_card_id: item.study_card_id,
								quantity: item.quantity,
								price: item.price,
							},
							{ transaction: t }
						)
					)
				)

				// Уменьшение количества доступных товаров
				await Promise.all(
					orderItems.map((item) =>
						StudyCard.decrement('quantity', {
							by: item.quantity,
							where: { id: item.study_card_id },
							transaction: t,
						})
					)
				)

				return { order, createdOrderItems }
			})

			// Получение созданного заказа с деталями
			const createdOrder = await Order.findByPk(result.order.id, {
				include: [
					{
						model: OrderItem,
						as: 'orderItems',
						include: [
							{
								model: StudyCard,
								as: 'studyCard',
								attributes: ['id', 'title', 'image_url'],
							},
						],
					},
				],
			})

			return res.status(201).json(createdOrder)
		} catch (error) {
			console.error('Ошибка при создании заказа:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Обновление статуса заказа
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async updateOrderStatus(req, res) {
		try {
			// Проверка прав доступа (только администраторы могут обновлять статус заказов)
			if (!req.user || !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			const { id } = req.params
			const { status } = req.body

			// Проверка обязательных полей
			if (!status) {
				return res
					.status(400)
					.json({ message: 'Необходимо указать новый статус заказа' })
			}

			// Проверка корректности статуса
			const validStatuses = [
				'pending',
				'processing',
				'shipped',
				'delivered',
				'cancelled',
			]
			if (!validStatuses.includes(status)) {
				return res.status(400).json({
					message:
						'Недопустимый статус. Допустимые значения: ' +
						validStatuses.join(', '),
				})
			}

			// Получение заказа
			const order = await Order.findByPk(id)
			if (!order) {
				return res.status(404).json({ message: 'Заказ не найден' })
			}

			// Если заказ уже доставлен или отменен, его статус нельзя изменить
			if (order.status === 'delivered' || order.status === 'cancelled') {
				return res.status(400).json({
					message:
						'Нельзя изменить статус доставленного или отмененного заказа',
				})
			}

			// Если меняем статус на "отменен", то нужно вернуть товары на склад
			if (status === 'cancelled' && order.status !== 'cancelled') {
				await db.sequelize.transaction(async (t) => {
					// Получаем все позиции заказа
					const orderItems = await OrderItem.findAll({
						where: { order_id: order.id },
						transaction: t,
					})

					// Возвращаем товары на склад
					await Promise.all(
						orderItems.map((item) =>
							StudyCard.increment('quantity', {
								by: item.quantity,
								where: { id: item.study_card_id },
								transaction: t,
							})
						)
					)

					// Обновляем статус заказа
					order.status = status
					await order.save({ transaction: t })
				})
			} else {
				// Просто обновляем статус
				order.status = status
				await order.save()
			}

			return res.status(200).json({
				message: 'Статус заказа успешно обновлен',
				order,
			})
		} catch (error) {
			console.error('Ошибка при обновлении статуса заказа:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Отмена заказа пользователем
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async cancelOrder(req, res) {
		try {
			// Проверка авторизации
			if (!req.user) {
				return res.status(401).json({ message: 'Необходима авторизация' })
			}

			const { id } = req.params
			const userId = req.user.id

			// Получение заказа
			const order = await Order.findByPk(id)
			if (!order) {
				return res.status(404).json({ message: 'Заказ не найден' })
			}

			// Проверка прав доступа (пользователь может отменять только свои заказы)
			if (order.user_id !== userId) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			// Проверка возможности отмены (можно отменить только заказы в статусе pending или processing)
			if (order.status !== 'pending' && order.status !== 'processing') {
				return res.status(400).json({
					message:
						'Можно отменить только заказы в статусе "ожидание" или "в обработке"',
				})
			}

			// Отмена заказа и возврат товаров на склад
			await db.sequelize.transaction(async (t) => {
				// Получаем все позиции заказа
				const orderItems = await OrderItem.findAll({
					where: { order_id: order.id },
					transaction: t,
				})

				// Возвращаем товары на склад
				await Promise.all(
					orderItems.map((item) =>
						StudyCard.increment('quantity', {
							by: item.quantity,
							where: { id: item.study_card_id },
							transaction: t,
						})
					)
				)

				// Обновляем статус заказа
				order.status = 'cancelled'
				await order.save({ transaction: t })
			})

			return res.status(200).json({
				message: 'Заказ успешно отменен',
				order,
			})
		} catch (error) {
			console.error('Ошибка при отмене заказа:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}

	/**
	 * Получение статистики по заказам (для администраторов)
	 * @param {Object} req - Express request object
	 * @param {Object} res - Express response object
	 */
	async getOrdersStatistics(req, res) {
		try {
			// Проверка прав доступа (только администраторы могут получать статистику)
			if (!req.user || !req.user.roles.includes('admin')) {
				return res.status(403).json({ message: 'Доступ запрещен' })
			}

			const { period = 'month' } = req.query

			let startDate, groupFormat
			const now = new Date()

			// Определение периода для статистики
			switch (period) {
				case 'week':
					startDate = new Date(now)
					startDate.setDate(now.getDate() - 7)
					groupFormat = 'YYYY-MM-DD'
					break
				case 'month':
					startDate = new Date(now)
					startDate.setMonth(now.getMonth() - 1)
					groupFormat = 'YYYY-MM-DD'
					break
				case 'year':
					startDate = new Date(now)
					startDate.setFullYear(now.getFullYear() - 1)
					groupFormat = 'YYYY-MM'
					break
				default:
					startDate = new Date(now)
					startDate.setMonth(now.getMonth() - 1)
					groupFormat = 'YYYY-MM-DD'
			}

			// Получение общей статистики
			const totalOrders = await Order.count()
			const pendingOrders = await Order.count({ where: { status: 'pending' } })
			const totalRevenue = await Order.sum('total_amount', {
				where: { status: { [Op.ne]: 'cancelled' } },
			})

			// Получение статистики по статусам
			const statusStats = await Order.findAll({
				attributes: [
					'status',
					[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
				],
				group: ['status'],
			})

			// Получение статистики по периоду
			const periodStats = await Order.findAll({
				attributes: [
					[
						db.sequelize.fn(
							'date_trunc',
							period,
							db.sequelize.col('created_at')
						),
						'date',
					],
					[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'orders'],
					[db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'revenue'],
				],
				where: {
					created_at: { [Op.gte]: startDate },
				},
				group: [
					db.sequelize.fn('date_trunc', period, db.sequelize.col('created_at')),
				],
			})

			return res.status(200).json({
				total: {
					orders: totalOrders,
					pendingOrders,
					revenue: totalRevenue || 0,
				},
				byStatus: statusStats,
				byPeriod: periodStats,
			})
		} catch (error) {
			console.error('Ошибка при получении статистики заказов:', error)
			return res.status(500).json({ message: 'Внутренняя ошибка сервера' })
		}
	}
}

module.exports = new OrderController()
