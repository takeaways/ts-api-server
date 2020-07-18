import {
	Model,
	DataTypes,
	BelongsToManyGetAssociationsMixin,
	HasManyGetAssociationsMixin,
	BelongsToManyRemoveAssociationMixin,
	BelongsToManyAddAssociationMixin,
} from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from '.';
import Post from './post';

class User extends Model {
	public readonly id!: number;
	public nickname!: string;
	public userId!: string;
	public password!: string;
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;

	public readonly Posts?: Post[];
	public readonly Followings?: User[];
	public readonly Followers?: User[];

	public addFollowings!: BelongsToManyAddAssociationMixin<User, number>;
	public getFollowings!: BelongsToManyGetAssociationsMixin<User>;
	public removeFollowing!: BelongsToManyRemoveAssociationMixin<User, number>;
	public getFollowers!: BelongsToManyGetAssociationsMixin<User>;
	public removeFollower!: BelongsToManyRemoveAssociationMixin<User, number>;
	public getPosts!: HasManyGetAssociationsMixin<Post>;
}

User.init(
	{
		nickname: {
			type: DataTypes.STRING(20),
		},
		userId: {
			type: DataTypes.STRING(20),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
	},
	{
		sequelize,
		modelName: 'User',
		tableName: 'user',
		charset: 'utf8',
		collate: 'utf8_general_ci',
	}
);

export const associate = (db: dbType) => {
	db.User.hasMany(db.Todo);
	db.User.hasMany(db.Post, { as: 'Posts' });
	db.User.hasMany(db.Comment);
	db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
	db.User.belongsToMany(db.User, {
		through: 'Follow',
		as: 'Followers',
		foreignKey: 'followingId',
	});
	db.User.belongsToMany(db.User, {
		through: 'Follow',
		as: 'Followings',
		foreignKey: 'followerId',
	});
};

export default User;
