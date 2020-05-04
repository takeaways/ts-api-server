import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as passport from 'passport';
import * as isAuth from '../middlewares/loginCheck';
import User from '../models/user';
import Post from '../models/post';
import Image from '../models/image';

const router = express.Router();

interface IUser extends User {
	PostCnt: number;
	FollowingCnt: number;
	FollowersCnt: number;
}

router.get('/', isAuth.isLoggedIn, async (req, res) => {
	const user = req.user!.toJSON() as User;
	delete user.password;
	return res.json(user);
});
router.post('/', isAuth.isNotLoggedInt, async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: {
				userId: req.body.userId,
			},
		});
		if (user) {
			return res.json({
				message: '이미 사용중인 아이디 입니다.',
			});
		}

		const hashedPassword = await bcrypt.hash(req.body.password, 12);
		const newUser = await User.create({
			nickname: req.body.nickname,
			userId: req.body.userId,
			password: hashedPassword,
		});
		const userJson = newUser.toJSON();
		delete (userJson as User).password;
		return res.status(200).json(userJson);
	} catch (error) {
		next(error);
	}
});

router.post('/login', isAuth.isNotLoggedInt, (req, res, next) => {
	passport.authenticate(
		'local',
		(err: Error, user: User, info: { message: string }) => {
			if (err) {
				console.error(err);
				return next(err);
			}
			if (info) {
				return res.status(401).send(info.message);
			}
			return req.login(user, async (loginErr: Error) => {
				try {
					if (loginErr) {
						return next(loginErr);
					}
					const fullUser = await User.findOne({
						where: { id: user.id },
						include: [
							{
								model: Post,
								as: 'Posts',
								attributes: ['id'],
							},
							{
								model: User,
								as: 'Followings',
								attributes: ['id'],
							},
							{
								model: User,
								as: 'Followers',
								attributes: ['id'],
							},
						],
						attributes: {
							exclude: ['password'],
						},
					});
					return res.json(fullUser);
				} catch (e) {
					console.error(e);
					return next(e);
				}
			});
		}
	)(req, res, next);
});

router.post('/logout', (req, res) => {
	req.logout();
	req.session?.destroy(() => {
		res.status(200).json({
			message: '로그아웃 했습니다.',
		});
	});
});

router.get('/:id', async (req, res, next) => {
	try {
		const id = parseInt(req.params.id);
		if (Number.isNaN(id)) {
			return res.status(409).json({
				message: '요청하신 아이디는 없는 사용자 입니다.',
			});
		}
		const user = await User.findOne({
			where: {
				id: req.params.id,
			},
			include: [
				{
					model: Post,
					as: 'Posts',
					include: ['id'],
				},
				{
					model: User,
					as: 'Followings',
					include: ['id'],
				},
				{
					model: User,
					as: 'Followers',
					include: ['id'],
				},
			],
			attributes: {
				exclude: ['password'],
			},
		});
		if (!user)
			return res.status(400).json({
				message: 'Not Found User!!',
			});
		const requestUser = user.toJSON() as IUser;
		requestUser.PostCnt = requestUser.Posts!.length;
		requestUser.FollowingCnt = requestUser.Followings!.length;
		requestUser.FollowersCnt = requestUser.Followers!.length;

		res.status(200).json(requestUser);
	} catch (error) {
		next(error);
	}
});

router.get('/:id/followings', isAuth.isLoggedIn, async (req, res, next) => {
	``;
	try {
		const user = (await User.findOne({
			where: {
				id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
			},
		})) as User;
		if (!user)
			return res.status(404).json({
				message: 'Not Found User...',
			});

		const followings = await user.getFollowings({
			attributes: ['id', 'nickname'],
			limit: parseInt(req.query.limit.toString(), 10),
			offset: parseInt(req.query.offset.toString(), 10),
		});
		return res.json(followings);
	} catch (error) {
		next(error);
	}
});

router.delete('/:id/follower', isAuth.isLoggedIn, async (req, res, next) => {
	try {
		const me = (await User.findOne({
			where: {
				id: req.user!.id,
			},
		})) as User;
		await me!.removeFollower(parseInt(req.params.id, 10));
		res.json({
			message: `${req.params.id} removed follower`,
		});
	} catch (error) {
		next(error);
	}
});

router.post('/:id/follow', isAuth.isLoggedIn, async (req, res, next) => {
	try {
		const me = (await User.findOne({
			where: {
				id: req.user!.id,
			},
		})) as User;
		await me!.addFollowings(parseInt(req.params.id, 10));
		res.json({
			message: `${req.user!.id} add follow`,
		});
	} catch (error) {
		next(error);
	}
});

router.get('/:id/posts', async (req, res, next) => {
	try {
		const posts = await Post.findAll({
			where: {
				UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
				RetweetId: null,
			},
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
			],
		});
		res.json(posts);
	} catch (error) {
		next(error);
	}
});

router.patch('/:id/nickname', isAuth.isLoggedIn, async (req, res, next) => {
	try {
		await User.update(
			{
				nickname: req.body.nickname,
			},
			{
				where: {
					id: req.user!.id,
				},
			}
		);
		res.json({
			message: `${req.body.nickname} 으로 변경 처리 되었습니다.`,
		});
	} catch (error) {
		next(error);
	}
});

export default router;
