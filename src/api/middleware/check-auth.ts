import { NextFunction, Response, Request } from "express";
import jwt from 'jsonwebtoken';
import { IJwt } from "../models/ijwt";

export interface IGetUserAuthInfoRequest extends Request {
	userData?: IJwt;
}

export default (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
	try {
		const authorization = req.headers.authorization;

		if (!authorization)
			throw Error();

		const token = authorization.split(" ")[1];
		const decoded = jwt.verify(token, process.env.JWT_KEY as jwt.Secret);
		req.userData = decoded as IJwt;
		next();
	} catch (error) {
		return res.status(401).json({
			message: 'Auth failed'
		});
	}
};