const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Person = require("../models/person");

router.get('/', (req, res, next) => {
    Person.find()
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.post('/', (req, res, next) => {
    console.log("POST Person 1");
    console.log(req.body.name);
    console.log(req.body.age);
    const person = new Person({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        age: req.body.age
    });
    console.log("POST Person 2");
    person
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

router.get('/:personId', (req, res, next) => {
    const id = req.params.productId;
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

router.patch('/:personId', (req, res, next) => {
    const id = req.params.personId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Person.update({ _id: id }, { $set: updateOps })
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

router.delete('/:personId', (req, res, next) => {
    const id = req.params.productId;
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

module.exports = router;