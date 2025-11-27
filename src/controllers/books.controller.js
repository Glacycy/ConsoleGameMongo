const booksService = require('../services/books.service');

class BooksController {
  async getAllBooks(req, res) {
    try {
      const books = await booksService.getAllBooks();
      res.render('index', { books, error: null, success: null });
    } catch (error) {
      console.error('Erreur lors de la récupération des livres:', error);
      res.render('index', { books: [], error: error.message, success: null });
    }
  }

  async createBook(req, res) {
    try {
      await booksService.createBook(req.body);
      const books = await booksService.getAllBooks();
      res.render('index', { books, error: null, success: 'Livre ajouté avec succès!' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du livre:', error);

      let errorMessage = error.message;
      if (error.code === 11000) {
        errorMessage = 'Un livre avec ce titre existe déjà.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Validation échouée: Vérifiez que tous les champs requis sont remplis correctement (année > 1900).';
      }

      const books = await booksService.getAllBooks();
      res.render('index', { books, error: errorMessage, success: null });
    }
  }

  async updateBook(req, res) {
    try {
      await booksService.updateBook(req.params.id, req.body);
      const books = await booksService.getAllBooks();
      res.render('index', { books, error: null, success: 'Livre mis à jour avec succès!' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du livre:', error);

      let errorMessage = error.message;
      if (error.code === 11000) {
        errorMessage = 'Un livre avec ce titre existe déjà.';
      } else if (error.message && error.message.includes('validation')) {
        errorMessage = 'Validation échouée: Vérifiez que tous les champs requis sont remplis correctement (année > 1900).';
      }

      const books = await booksService.getAllBooks();
      res.render('index', { books, error: errorMessage, success: null });
    }
  }

  async deleteBook(req, res) {
    try {
      await booksService.deleteBook(req.params.id);
      const books = await booksService.getAllBooks();
      res.render('index', { books, error: null, success: 'Livre supprimé avec succès!' });
    } catch (error) {
      console.error('Erreur lors de la suppression du livre:', error);
      const books = await booksService.getAllBooks();
      res.render('index', { books, error: error.message, success: null });
    }
  }
}

module.exports = new BooksController();
