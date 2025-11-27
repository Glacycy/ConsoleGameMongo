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
});
