import * as express from 'express';
import * as multer from 'multer';
import * as isAuth from '../middlewares/loginCheck';
import Post from '../models/post';
import Hashtag from '../models/hashtag';
import Image from '../models/image';
import User from '../models/user';
const router = express.Router();

const upload = multer({
	dest: 'uploads/',
});

router.post(
	'/',
	isAuth.isLoggedIn,
	upload.single('image'),
	async (req, res, next) => {
		try {
			const hashtags: string[] = req.body.content.match(/#[^\s]+/g);
			const newPost = await Post.create({
				content: req.body.content,
				UserId: req.user!.id,
			});
			if (hashtags) {
				const tags = hashtags.map((h) =>
					Hashtag.findOrCreate({ where: { name: h.slice(1).toLowerCase() } })
				);
				const result = await Promise.all(tags);
				await newPost.addHashtags(result.map((r) => r[0]));
			}
			if (req.body.image) {
				if (Array.isArray(req.body.image)) {
					const imgs = req.body.image.map((i: string) =>
						Image.create({
							src: i,
						})
					);
					const result = await Promise.all(imgs);
					await newPost.addImages(result);
				} else {
					const img = await Image.create({ src: req.body.image });
					await newPost.addImage(img);
				}
			}
			const fullPost = await Post.findOne({
				where: { id: newPost.id },
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
			return res.json(fullPost);
		} catch (error) {
			next(error);
		}
	}
);

router.post('/images', upload.array('image'), async (req, res, next) => {
	try {
		console.log(req.files);
		if (Array.isArray(req.files)) {
			res.json(req.files.map((v) => v.path));
		}
	} catch (error) {
		next(error);
	}
});

export default router;
