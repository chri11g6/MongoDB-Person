import express, { NextFunction, Request, Response, Router } from "express";
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
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
		});;

	});
});

router.delete('/:userId', (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.userId;
	console.log(id);
    User.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({message: "User deleted"});
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

export default router;