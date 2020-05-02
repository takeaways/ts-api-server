import * as express from 'express';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as dotenv from 'dotenv';
import * as hpp from 'hpp';
import * as helmet from 'helmet';

dotenv.config();
const app = express();
app.set('PORT', process.env.PORT || 8000);
const ENV: boolean = process.env.NODE_ENV === 'production' ? true : false;

if (ENV) {
	app.use(hpp());
	app.use(helmet());
	app.use(morgan('combined'));
	app.use(
		cors({
			origin: /geoniljang\.com$/,
			credentials: true
		})
	);
} else {
	app.use(morgan('dev'));
	app.use(
		cors({
			origin: true,
			credentials: true
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
			domain: ENV ? '.geoniljang.com' : undefined
		},
		name: 'ngi'
	})
);

app.get('/', (req, res) => {
	res.send('Hell owlrd');
});

app.listen(app.get('PORT'), () => {
	console.log('Server is Running on Port ' + app.get('PORT'));
});
