import express, { NextFunction, Request, Response, Router } from "express";
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { IJwt } from "../models/IJwt";
const router: Router = express.Router();

router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
	let userData = await User.find({ email: req.body.email }).exec();

	if (userData.length >= 1)
		return res.status(409).json({ message: "Mail exits" });

	bcrypt.hash(req.body.password, 10, (err, hash) => {
		if (err) {
			return res.status(500).json({
				error: err
			});
		}

		const user = new User({
			_id: new Types.ObjectId(),
			email: req.body.email,
			password: hash
		});

		user.save().then(result => {
			console.log(result);
			res.status(201).json({
				message: "User created"
			});
		})
			.catch(err => {
				console.log(err);
				res.status(500).json({
					error: err
				});
			});

	});
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
	let userData = await User.find({ email: req.body.email }).exec();

	if (userData.length < 1)
		return res.status(401).json({ message: "Auth failed" });

	bcrypt.compare(req.body.password, userData[0].password, (err, result) => {
		if (err || !result) {
			return res.status(401).json({
				message: "Auth failed"
			});
		}

		const tokenData: IJwt = {
			email: userData[0].email,
			userId: userData[0]._id as unknown as number
		}

		const token = jwt.sign(
			tokenData,
			process.env.JWT_KEY as jwt.Secret,
			{
				expiresIn: "1h"
			}
		);

		return res.status(200).json({
			message: "Auth successful",
			token: token
		});

	});

	// return res.status(401).json({
	// 	message: "Auth failed"
	// });
});

router.delete('/:userId', (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.userId;
	console.log(id);
	User.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({ message: "User deleted" });
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

export default router;