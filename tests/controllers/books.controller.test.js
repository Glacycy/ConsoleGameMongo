const booksController = require('../../src/controllers/books.controller');
const booksService = require('../../src/services/books.service');

jest.mock('../../src/services/books.service');

describe('Books Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };

    res = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe('getAllBooks', () => {
    it('should render index view with all books', async () => {
      const mockBooks = [
        { titre: 'Book 1', auteur: 'Author 1', année: 2020 },
        { titre: 'Book 2', auteur: 'Author 2', année: 2021 }
      ];

      booksService.getAllBooks.mockResolvedValue(mockBooks);

      await booksController.getAllBooks(req, res);

      expect(booksService.getAllBooks).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('index', {
        books: mockBooks,
        error: null,
        success: null
      });
    });

    it('should render error when service fails', async () => {
      const errorMessage = 'Database error';
      booksService.getAllBooks.mockRejectedValue(new Error(errorMessage));

      await booksController.getAllBooks(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        books: [],
        error: errorMessage,
        success: null
      });
    });
  });

  describe('createBook', () => {
    it('should create a book and render success', async () => {
      const bookData = {
        titre: 'New Book',
        auteur: 'Author',
        année: '2023',
        genre: 'Fiction'
      };

      const mockBooks = [{ titre: 'New Book' }];

      req.body = bookData;
      booksService.createBook.mockResolvedValue({ insertedId: '123' });
      booksService.getAllBooks.mockResolvedValue(mockBooks);

      await booksController.createBook(req, res);

      expect(booksService.createBook).toHaveBeenCalledWith(bookData);
      expect(booksService.getAllBooks).toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('index', {
        books: mockBooks,
        error: null,
        success: 'Livre ajouté avec succès!'
      });
    });

    it('should handle duplicate book error', async () => {
      const error = new Error('Duplicate key');
      error.code = 11000;

      req.body = { titre: 'Duplicate Book' };
      booksService.createBook.mockRejectedValue(error);
      booksService.getAllBooks.mockResolvedValue([]);

      await booksController.createBook(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        books: [],
        error: 'Un livre avec ce titre existe déjà.',
        success: null
      });
    });

    it('should handle validation error', async () => {
      const error = new Error('validation failed');
      req.body = { titre: 'Book', auteur: 'Author', année: '1800' };
      booksService.createBook.mockRejectedValue(error);
      booksService.getAllBooks.mockResolvedValue([]);

      await booksController.createBook(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        books: [],
        error: 'Validation échouée: Vérifiez que tous les champs requis sont remplis correctement (année > 1900).',
        success: null
      });
    });

    it('should handle generic error', async () => {
      const error = new Error('Some error');
      req.body = { titre: 'Book', auteur: 'Author', année: '2023' };
      booksService.createBook.mockRejectedValue(error);
      booksService.getAllBooks.mockResolvedValue([]);

      await booksController.createBook(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        books: [],
        error: 'Some error',
        success: null
      });
    });
  });

  describe('updateBook', () => {
    it('should update a book and render success', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      const bookData = {
        titre: 'Updated Book',
        auteur: 'Updated Author',
        année: '2024',
        genre: 'Drama'
      };

      const mockBooks = [{ titre: 'Updated Book' }];

      req.params.id = bookId;
      req.body = bookData;
      booksService.updateBook.mockResolvedValue({ modifiedCount: 1 });
      booksService.getAllBooks.mockResolvedValue(mockBooks);

      await booksController.updateBook(req, res);

      expect(booksService.updateBook).toHaveBeenCalledWith(bookId, bookData);
      expect(res.render).toHaveBeenCalledWith('index', {
        books: mockBooks,
        error: null,
        success: 'Livre mis à jour avec succès!'
      });
    });

    it('should handle update error', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      const error = new Error('Update failed');

      req.params.id = bookId;
      req.body = { titre: 'Book' };
      booksService.updateBook.mockRejectedValue(error);
      booksService.getAllBooks.mockResolvedValue([]);

      await booksController.updateBook(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        books: [],
        error: 'Update failed',
        success: null
      });
    });
  });

  describe('deleteBook', () => {
    it('should delete a book and render success', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      const mockBooks = [];

      req.params.id = bookId;
      booksService.deleteBook.mockResolvedValue({ deletedCount: 1 });
      booksService.getAllBooks.mockResolvedValue(mockBooks);

      await booksController.deleteBook(req, res);

      expect(booksService.deleteBook).toHaveBeenCalledWith(bookId);
      expect(res.render).toHaveBeenCalledWith('index', {
        books: mockBooks,
        error: null,
        success: 'Livre supprimé avec succès!'
      });
    });

    it('should handle deletion error', async () => {
      const bookId = '507f1f77bcf86cd799439011';
      const error = new Error('Delete failed');

      req.params.id = bookId;
      booksService.deleteBook.mockRejectedValue(error);
      booksService.getAllBooks.mockResolvedValue([]);

      await booksController.deleteBook(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        books: [],
        error: 'Delete failed',
        success: null
      });
    });
  });

  describe('createManyBooks', () => {
    it('should create multiple books and render success', async () => {
      const booksJSON = JSON.stringify([
        { titre: 'Book 1', auteur: 'Author 1', année: 2020 },
        { titre: 'Book 2', auteur: 'Author 2', année: 2021 }
      ]);

      const mockBooks = [
        { titre: 'Book 1', auteur: 'Author 1', année: 2020 },
        { titre: 'Book 2', auteur: 'Author 2', année: 2021 }
      ];

      req.body.books = booksJSON;
      booksService.createManyBooks.mockResolvedValue({ insertedCount: 2, acknowledged: true });
      booksService.getAllBooks.mockResolvedValue(mockBooks);

      await booksController.createManyBooks(req, res);

      expect(booksService.createManyBooks).toHaveBeenCalledWith(JSON.parse(booksJSON));
      expect(res.render).toHaveBeenCalledWith('index', {
        books: mockBooks,
        error: null,
        success: '2 livre(s) ajouté(s) avec succès!'
      });
    });

    it('should handle JSON parse error', async () => {
      req.body.books = 'invalid json';
      booksService.getAllBooks.mockResolvedValue([]);

      await booksController.createManyBooks(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        books: [],
        error: 'Format JSON invalide. Vérifiez la syntaxe.',
        success: null
      });
    });

    it('should handle service error', async () => {
      const booksJSON = JSON.stringify([
        { titre: 'Book 1', auteur: 'Author 1', année: 2020 }
      ]);

      req.body.books = booksJSON;
      booksService.createManyBooks.mockRejectedValue(new Error('Insert failed'));
      booksService.getAllBooks.mockResolvedValue([]);

      await booksController.createManyBooks(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        books: [],
        error: 'Insert failed',
        success: null
      });
    });
  });

  describe('deleteBookByTitle', () => {
    it('should delete a book by title and render success', async () => {
      const titre = 'Book to Delete';
      const mockBooks = [];

      req.body.titre = titre;
      booksService.deleteBookByTitle.mockResolvedValue({ deletedCount: 1, acknowledged: true });
      booksService.getAllBooks.mockResolvedValue(mockBooks);

      await booksController.deleteBookByTitle(req, res);

      expect(booksService.deleteBookByTitle).toHaveBeenCalledWith(titre);
      expect(res.render).toHaveBeenCalledWith('index', {
        books: mockBooks,
        error: null,
        success: 'Livre supprimé avec succès!'
      });
    });

    it('should render error when no book found', async () => {
      const titre = 'Non-existent Book';
      const mockBooks = [{ titre: 'Other Book' }];

      req.body.titre = titre;
      booksService.deleteBookByTitle.mockResolvedValue({ deletedCount: 0, acknowledged: true });
      booksService.getAllBooks.mockResolvedValue(mockBooks);

      await booksController.deleteBookByTitle(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        books: mockBooks,
        error: 'Aucun livre trouvé avec ce titre',
        success: null
      });
    });

    it('should handle service error', async () => {
      req.body.titre = 'Test Book';
      booksService.deleteBookByTitle.mockRejectedValue(new Error('Delete failed'));
      booksService.getAllBooks.mockResolvedValue([]);

      await booksController.deleteBookByTitle(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        books: [],
        error: 'Delete failed',
        success: null
      });
    });

    it('should accept titre from params', async () => {
      const titre = 'Book from params';

      req.params.titre = titre;
      booksService.deleteBookByTitle.mockResolvedValue({ deletedCount: 1, acknowledged: true });
      booksService.getAllBooks.mockResolvedValue([]);

      await booksController.deleteBookByTitle(req, res);

      expect(booksService.deleteBookByTitle).toHaveBeenCalledWith(titre);
    });
  });

  describe('deleteBooksByAuthor', () => {
    it('should delete all books by author and render success', async () => {
      const auteur = 'J.K. Rowling';
      const mockBooks = [];

      req.body.auteur = auteur;
      booksService.deleteBooksByAuthor.mockResolvedValue({ deletedCount: 3, acknowledged: true });
      booksService.getAllBooks.mockResolvedValue(mockBooks);

      await booksController.deleteBooksByAuthor(req, res);

      expect(booksService.deleteBooksByAuthor).toHaveBeenCalledWith(auteur);
      expect(res.render).toHaveBeenCalledWith('index', {
        books: mockBooks,
        error: null,
        success: '3 livre(s) supprimé(s) avec succès!'
      });
    });

    it('should render error when no books found for author', async () => {
      const auteur = 'Non-existent Author';
      const mockBooks = [{ titre: 'Other Book' }];

      req.body.auteur = auteur;
      booksService.deleteBooksByAuthor.mockResolvedValue({ deletedCount: 0, acknowledged: true });
      booksService.getAllBooks.mockResolvedValue(mockBooks);

      await booksController.deleteBooksByAuthor(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        books: mockBooks,
        error: 'Aucun livre trouvé pour cet auteur',
        success: null
      });
    });

    it('should handle service error', async () => {
      req.body.auteur = 'Test Author';
      booksService.deleteBooksByAuthor.mockRejectedValue(new Error('Delete failed'));
      booksService.getAllBooks.mockResolvedValue([]);

      await booksController.deleteBooksByAuthor(req, res);

      expect(res.render).toHaveBeenCalledWith('index', {
        books: [],
        error: 'Delete failed',
        success: null
      });
    });

    it('should accept auteur from params', async () => {
      const auteur = 'Author from params';

      req.params.auteur = auteur;
      booksService.deleteBooksByAuthor.mockResolvedValue({ deletedCount: 2, acknowledged: true });
      booksService.getAllBooks.mockResolvedValue([]);

      await booksController.deleteBooksByAuthor(req, res);

      expect(booksService.deleteBooksByAuthor).toHaveBeenCalledWith(auteur);
    });
  });
});
