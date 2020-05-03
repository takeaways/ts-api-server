export * from './sequelize';

import User, { associate as associateUser } from './user';
import Post, { associate as associatePost } from './post';
import Image, { associate as associateImage } from './image';
import Hashtag, { associate as associateHashtag } from './hashtag';
import Comment, { associate as associateComment } from './comment';

const db = {
	User,
	Post,
	Image,
	Hashtag,
	Comment
};

export type dbType = typeof db;

associateUser(db);
associatePost(db);
associateImage(db);
associateHashtag(db);
associateComment(db);
