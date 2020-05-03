import { Model, DataTypes } from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from '.';
class Image extends Model {
	public readonly id!: number;
	public src!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Image.init(
	{
		src: {
			type: DataTypes.STRING(300),
			allowNull: false
		}
	},
	{
		sequelize,
		modelName: 'Image',
		tableName: 'Image',
		charset: 'utf8',
		collate: 'utf8_general_ci'
	}
);

export const associate = (db: dbType) => {};

export default Image;
