import * as passport from 'passport';
import User from '../models/user';
import { AsyncLocalStorage } from 'async_hooks';

export default () => {
	//login time once
	passport.serializeUser((user: User, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id: number, done) => {
		try {
			const user = await User.findOne({
				where: {
					id
				}
			});
			return done(null, user); // req.user
		} catch (e) {
			console.error(e);
			return done(e);
		}
	});

	// local();
};
