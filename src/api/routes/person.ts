import express, { NextFunction, Request, Response, Router } from "express";
import { Types } from 'mongoose';
import { Person } from '../models/person';
const router: Router = express.Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    Person.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    const personData = new Person({
        _id: new Types.ObjectId(),
        name: req.body.name,
        age: req.body.age
    });
    personData
        .save()
        .then(result => {
            res.status(201).json({
                message: "Handling POST requests to /Person",
                createdProduct: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:personId', (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.personId;
    Person.findById(id)
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res
                    .status(404)
                    .json({ message: "No valid entry found for provided ID" });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.patch('/:personId', (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.personId;
    Person.updateOne({ _id: id }, { $set: req.body })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:personId', (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.personId;
    Person.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

export default router;