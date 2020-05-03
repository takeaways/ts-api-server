import User from '../../models/user';

declare module 'express-serve-static-core' {
	interface Request {
		user?: User;
	}
}

// declare global {
// 	namespace Express {
// 		interface Request {
// 			query: {
// 				limit: string;
// 				offset: string;
// 			};
// 		}
// 	}
// }
