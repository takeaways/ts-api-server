import * as express from 'express';
import * as multer from 'multer';
import * as isAuth from '../middlewares/loginCheck';
import Post from '../models/post';
import Hashtag from '../models/hashtag';
import Image from '../models/image';
import User from '../models/user';
import Comment from '../models/comment';
import Todo from '../models/todo';
const router = express.Router();

router.post('/', isAuth.isLoggedIn, async (req, res, next) => {
	try {
		const newTodo = await Todo.create({
			content: req.body.content,
			UserId: req.user!.id,
		});

		const todo = await Todo.findOne({
			where: { id: newTodo.id },
			include: [
				{
					model: User,
					attributes: ['id', 'nickname'],
				},
			],
		});
		return res.json(todo);
	} catch (error) {
		next(error);
	}
});

router.get('/', isAuth.isLoggedIn, async (req, res, next) => {
	try {
		const todos = await Todo.findAll({
			where: { UserId: req.user!.id },
			include: [
				{
					model: User,
					attributes: ['id', 'nickname'],
				},
			],
		});
		if (!todos)
			return res.status(404).json({
				message: 'Not Found Post',
			});
		return res.json(todos);
	} catch (error) {
		next(error);
	}
});

router.delete('/:id', isAuth.isLoggedIn, async (req, res, next) => {
	try {
		const post = await Post.findOne({
			where: {
				id: req.params.id,
			},
		});
		if (!post)
			return res.status(404).json({
				message: 'Not Found Post',
			});

		await Post.destroy({
			where: {
				id: req.params.id,
			},
		});
		return res.json({
			message: 'Delete Post Success',
		});
	} catch (error) {
		next(error);
	}
});

export default router;
