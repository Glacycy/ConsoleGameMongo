const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');

router.get('/', booksController.getAllBooks.bind(booksController));
router.post('/add', booksController.createBook.bind(booksController));
router.post('/update/:id', booksController.updateBook.bind(booksController));
router.post('/delete/:id', booksController.deleteBook.bind(booksController));

module.exports = router;
