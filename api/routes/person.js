const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Persons were fetched'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Person was created'
    });
});

router.get('/:personId', (req, res, next) => {
    res.status(200).json({
        message: 'Person details',
        personId: req.params.personId
    });
});

router.delete('/:personId', (req, res, next) => {
    res.status(200).json({
        message: 'Person deleted',
        personId: req.params.personId
    });
});

module.exports = router;