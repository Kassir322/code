// models/User.js
const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	class User extends Model {
		static associate(models) {
			// Определяем связи между моделями
			User.hasMany(models.Order, {
				foreignKey: 'user_id',
				as: 'orders',
			})

			User.hasMany(models.Review, {
				foreignKey: 'user_id',
				as: 'reviews',
			})
		}
	}

	User.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			roles: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				defaultValue: ['customer'],
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: true,
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
			modelName: 'User',
			tableName: 'users',
			underscored: true, // использовать snake_case для столбцов в БД
			timestamps: true,
			createdAt: 'created_at',
			updatedAt: 'updated_at',
			hooks: {
				beforeSave: async (user) => {
					// Здесь можно добавить хук для хеширования пароля
					// Например:
					// if (user.changed('password')) {
					//   user.password = await bcrypt.hash(user.password, 10);
					// }
				},
			},
		}
	)

	return User
}
