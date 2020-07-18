import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import { sequelize } from './sequelize';

class Todo extends Model {
	public readonly id!: number;
	public content!: string;
	public UserId!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Todo.init(
	{
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Todo',
		tableName: 'todo',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
	}
);

export const associate = (db: dbType) => {
	db.Todo.belongsTo(db.User);
};
export default Todo;
