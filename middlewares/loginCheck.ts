import { NextFunction, Request, Response } from 'express';

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
	console.log('------>', req.cookies);

	if (req.isAuthenticated()) {
		next();
	} else {
		res.status(401).json({
			message: '로그인이 필요합니다.',
		});
	}
};

const isNotLoggedInt = (req: Request, res: Response, next: NextFunction) => {
	if (!req.isAuthenticated()) {
		next();
	} else {
		res.json({
			message: '로그인 사용자는 접근할 수 없습니다.',
		});
	}
};

export { isLoggedIn, isNotLoggedInt };
