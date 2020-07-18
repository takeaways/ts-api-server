import * as express from 'express';
import Post from '../models/post';
import * as Sequelize from 'sequelize';
import Hashtag from '../models/hashtag';
import User from '../models/user';
import Image from '../models/image';

console.log('s');
const router = express.Router();

router.get('/:tag', async (req, res, next) => {
  try {
    let where = {};
    if (parseInt(req.query.lastId.toString(), 10)) {
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
          model: Hashtag,
          where: {
            name: decodeURIComponent(req.params.tag),
          },
        },
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
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

export default router;
