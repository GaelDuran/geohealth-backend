const express = require('express');
const router = express.Router();
const Book = require('../models/book');

router.get('/', async (req, res) => {
    Book.find()
        .then(data => {
            res.json(data)
        })
        .catch(e => {
            res.json({ message: e })
        });
});

router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author
    });

    book.save()
        .then(data => {
            res.json(data)
        })
        .catch(e => {
            res.json({ message: e })
        });
});

router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, author } = req.body;

    Book.updateOne({ _id: id }, { $set: { title, description, author } })
        .then(data => {
            res.json(data)
        })
        .catch(e => {
            res.json({ message: e })
        });
});

router.delete('/:id', async (req, res) => {
    Book.deleteOne({ _id: req.params.id })
        .then(data => {
            res.json(data)
        })
        .catch(e => {
            res.json({ message: e })
        });
});

module.exports = router;