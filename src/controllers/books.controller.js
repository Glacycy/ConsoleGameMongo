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

  async createManyBooks(req, res) {
    try {
      const booksData = JSON.parse(req.body.books);
      const result = await booksService.createManyBooks(booksData);
      const books = await booksService.getAllBooks();
      res.render('index', {
        books,
        error: null,
        success: `${result.insertedCount} livre(s) ajouté(s) avec succès!`
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout des livres:', error);
      const books = await booksService.getAllBooks();

      let errorMessage = error.message;
      if (error instanceof SyntaxError) {
        errorMessage = 'Format JSON invalide. Vérifiez la syntaxe.';
      }

      res.render('index', { books, error: errorMessage, success: null });
    }
  }

  async deleteBookByTitle(req, res) {
    try {
      const titre = req.body.titre || req.params.titre;
      const result = await booksService.deleteBookByTitle(titre);
      const books = await booksService.getAllBooks();

      if (result.deletedCount === 0) {
        res.render('index', {
          books,
          error: 'Aucun livre trouvé avec ce titre',
          success: null
        });
      } else {
        res.render('index', {
          books,
          error: null,
          success: 'Livre supprimé avec succès!'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du livre par titre:', error);
      const books = await booksService.getAllBooks();
      res.render('index', { books, error: error.message, success: null });
    }
  }

  async deleteBooksByAuthor(req, res) {
    try {
      const auteur = req.body.auteur || req.params.auteur;
      const result = await booksService.deleteBooksByAuthor(auteur);
      const books = await booksService.getAllBooks();

      if (result.deletedCount === 0) {
        res.render('index', {
          books,
          error: 'Aucun livre trouvé pour cet auteur',
          success: null
        });
      } else {
        res.render('index', {
          books,
          error: null,
          success: `${result.deletedCount} livre(s) supprimé(s) avec succès!`
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des livres par auteur:', error);
      const books = await booksService.getAllBooks();
      res.render('index', { books, error: error.message, success: null });
    }
  }
}

module.exports = new BooksController();
