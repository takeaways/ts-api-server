import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';
import * as hpp from 'hpp';
import * as helmet from 'helmet';

import passportConfig from './passport';
import { sequelize } from './models';

import userRouter from './routers/user';
import postRouter from './routers/post';
import postsRouter from './routers/posts';
import hashtagRouter from './routers/hashtag';

dotenv.config();
const app = express();
passportConfig();
app.set('PORT', process.env.PORT || 8000);
const ENV: boolean = process.env.NODE_ENV === 'production' ? true : false;

if (ENV) {
	app.use(hpp());
	app.use(helmet());
	app.use(morgan('combined'));
	app.use(
		cors({
			origin: /geoniljang\.com$/,
			credentials: true,
		})
	);
} else {
	app.use(morgan('dev'));
	app.use(
		cors({
			origin: true,
			credentials: true,
		})
	);
}

app.use('/', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
	session({
		resave: false,
		saveUninitialized: false,
		secret: process.env.COOKIE_SECRET!,
		cookie: {
			httpOnly: true,
			secure: false,
			domain: ENV ? 'geoniljang.com' : undefined,
		},
		name: 'ngi',
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/hashtag', hashtagRouter);

sequelize
	.sync({ force: false })
	.then(() => {
		console.log('Database Connected....');
		app.listen(app.get('PORT'), () => {
			console.log('Server is Running on Port ' + app.get('PORT'));
		});
	})
	.catch((e: Error) => {
		console.log('------------------- s');
		console.log(e);
	});
