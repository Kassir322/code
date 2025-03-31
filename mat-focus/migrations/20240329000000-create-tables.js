// migrations/20240329000000-create-tables.js
'use strict'

module.exports = {
	up: async (queryInterface, Sequelize) => {
		// Создаем таблицу пользователей
		await queryInterface.createTable('users', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			roles: {
				type: Sequelize.ARRAY(Sequelize.STRING),
				defaultValue: ['customer'],
			},
			phone: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		})

		// Создаем таблицу категорий
		await queryInterface.createTable('categories', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			slug: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			is_active: {
				type: Sequelize.BOOLEAN,
				defaultValue: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		})

		// Создаем таблицу учебных карточек
		await queryInterface.createTable('study_cards', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			price: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},
			quantity: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			image_url: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			subject: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			school_grades: {
				type: Sequelize.ARRAY(Sequelize.INTEGER),
				allowNull: true,
			},
			card_type: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			number_of_cards: {
				type: Sequelize.INTEGER,
				allowNull: true,
			},
			category_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'categories',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT',
			},
			is_active: {
				type: Sequelize.BOOLEAN,
				defaultValue: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		})

		// Создаем таблицу заказов
		await queryInterface.createTable('orders', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT',
			},
			total_amount: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: 'pending',
			},
			shipping_address: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			payment_method: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			shipping_method: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		})

		// Создаем таблицу элементов заказа
		await queryInterface.createTable('order_items', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			order_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'orders',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			study_card_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'study_cards',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT',
			},
			quantity: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			price: {
				type: Sequelize.DECIMAL(10, 2),
				allowNull: false,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		})

		// Создаем таблицу отзывов
		await queryInterface.createTable('reviews', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			study_card_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'study_cards',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			rating: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			comment: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		})

		// Добавляем индексы для улучшения производительности
		await queryInterface.addIndex('users', ['email'])
		await queryInterface.addIndex('categories', ['slug'])
		await queryInterface.addIndex('study_cards', ['category_id'])
		await queryInterface.addIndex('orders', ['user_id'])
		await queryInterface.addIndex('order_items', ['order_id'])
		await queryInterface.addIndex('order_items', ['study_card_id'])
		await queryInterface.addIndex('reviews', ['study_card_id'])
		await queryInterface.addIndex('reviews', ['user_id'])
	},

	down: async (queryInterface, Sequelize) => {
		// Удаляем таблицы в обратном порядке для соблюдения ограничений внешних ключей
		await queryInterface.dropTable('reviews')
		await queryInterface.dropTable('order_items')
		await queryInterface.dropTable('orders')
		await queryInterface.dropTable('study_cards')
		await queryInterface.dropTable('categories')
		await queryInterface.dropTable('users')
	},
}
