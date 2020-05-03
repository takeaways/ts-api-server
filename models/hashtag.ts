import { Model, DataTypes } from 'sequelize';
import { dbType } from '.';
import { sequelize } from './sequelize';
import Post from './post';
class Hashtag extends Model {
	public readonly id!: number;
	public name!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Hashtag.init(
	{
		name: {
			type: DataTypes.STRING(20),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: 'Hashtag',
		tableName: 'hashtag',
		charset: 'utf8mb4',
		collate: 'utf8mb4_general_ci',
	}
);

export const associate = (db: dbType) => {
	db.Hashtag.belongsTo(db.Post);
};
export default Hashtag;
