// models/OrderItem.js
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	class OrderItem extends Model {
		static associate(models) {
			// Определяем связи между моделями
			OrderItem.belongsTo(models.Order, {
				foreignKey: 'order_id',
				as: 'order',
			})

			OrderItem.belongsTo(models.StudyCard, {
				foreignKey: 'study_card_id',
				as: 'studyCard',
			})
		}
	}

	OrderItem.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			order_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'orders',
					key: 'id',
				},
			},
			study_card_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'study_cards',
					key: 'id',
				},
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
				validate: {
					min: 1,
				},
			},
			price: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			created_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
			updated_at: {
				type: DataTypes.DATE,
				allowNull: false,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			modelName: 'OrderItem',
			tableName: 'order_items',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	)

	return OrderItem
}
