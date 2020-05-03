import * as express from 'express';
import * as Sequelize from 'sequelize';
import User from '../models/user';
import Image from '../models/image';
import Post from '../models/post';
import Hashtag from '../models/hashtag';

const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		let where = {};
		if (parseInt(req.query.listId as string, 10)) {
			where = {
				id: {
					[Sequelize.Op.lt]: parseInt(req.query.lastId.toString(), 10),
				},
			};
		}
		const posts = await Post.findAll({
			where,
			include: [
				{
					model: User,
					attributes: ['id', 'nickname'],
				},
				{
					model: Image,
				},
				{
					model: User,
					as: 'Likers',
					attributes: ['id'],
				},
				{
					model: Post,
					as: 'Retweet',
					include: [
						{
							model: User,
							attributes: ['id', 'nickname'],
						},
						{
							model: Image,
						},
					],
				},
			],
			order: [['createdAt', 'DESC']],
		});
		console.log(posts);
		return res.json(posts);
	} catch (error) {
		next(error);
	}
});

export default router;
