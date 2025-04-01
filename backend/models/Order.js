// models/Order.js
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	class Order extends Model {
		static associate(models) {
			// Определяем связи между моделями
			if (models.User) {
				Order.belongsTo(models.User, {
					foreignKey: 'user_id',
					as: 'user',
				})
			}

			if (models.OrderItem) {
				Order.hasMany(models.OrderItem, {
					foreignKey: 'order_id',
					as: 'orderItems',
				})
			}
		}
	}

	Order.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'users',
					key: 'id',
				},
			},
			total_amount: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			status: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: 'pending',
			},
			shipping_address: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			payment_method: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			shipping_method: {
				type: DataTypes.STRING,
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
			modelName: 'Order',
			tableName: 'orders',
			underscored: true,
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		}
	)

	return Order
}
