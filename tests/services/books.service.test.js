const { connect, disconnect } = require('../../src/config/db');
const booksService = require('../../src/services/books.service');

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await disconnect();
});

describe('Books Service', () => {
  describe('getAllBooks', () => {
    it('should return all books', async () => {
      const books = await booksService.getAllBooks();

      expect(Array.isArray(books)).toBe(true);

      if (books.length > 0) {
        expect(books[0]).toHaveProperty('titre');
        expect(books[0]).toHaveProperty('auteur');
        expect(books[0]).toHaveProperty('année');
      }
    });
  });

  describe('createBook', () => {
    let createdBookId;

    afterEach(async () => {
      if (createdBookId) {
        await booksService.deleteBook(createdBookId);
        createdBookId = null;
      }
    });

    it('should create a new book with all fields', async () => {
      const bookData = {
        titre: 'Test Book',
        auteur: 'Test Author',
        année: '2023',
        genre: 'Fiction'
      };

      const result = await booksService.createBook(bookData);

      expect(result).toHaveProperty('insertedId');
      expect(result.acknowledged).toBe(true);

      createdBookId = result.insertedId.toString();

      const createdBook = await booksService.getBookById(createdBookId);
      expect(createdBook).toBeDefined();
      expect(createdBook.titre).toBe('Test Book');
      expect(createdBook.auteur).toBe('Test Author');
      expect(createdBook.année).toBe(2023);
      expect(createdBook.genre).toBe('Fiction');
    });

    it('should create a book without optional genre', async () => {
      const bookData = {
        titre: 'Book Without Genre',
        auteur: 'Test Author',
        année: '2023',
        genre: ''
      };

      const result = await booksService.createBook(bookData);
      createdBookId = result.insertedId.toString();

      const createdBook = await booksService.getBookById(createdBookId);
      expect(createdBook).toBeDefined();
      expect(createdBook.titre).toBe('Book Without Genre');
      expect(createdBook).not.toHaveProperty('genre');
    });

    it('should parse année as integer', async () => {
      const bookData = {
        titre: 'Test Parse Year',
        auteur: 'Test Author',
        année: '2023',
        genre: 'Fiction'
      };

      const result = await booksService.createBook(bookData);
      createdBookId = result.insertedId.toString();

      const createdBook = await booksService.getBookById(createdBookId);
      expect(typeof createdBook.année).toBe('number');
      expect(createdBook.année).toBe(2023);
    });
  });

  describe('updateBook', () => {
    let testBookId;

    beforeEach(async () => {
      const bookData = {
        titre: 'Book To Update',
        auteur: 'Original Author',
        année: '2020',
        genre: 'Drama'
      };

      const result = await booksService.createBook(bookData);
      testBookId = result.insertedId.toString();
    });

    afterEach(async () => {
      if (testBookId) {
        await booksService.deleteBook(testBookId);
        testBookId = null;
      }
    });

    it('should update an existing book', async () => {
      const updateData = {
        titre: 'Updated Book Title',
        auteur: 'Updated Author',
        année: '2024',
        genre: 'Science Fiction'
      };

      const result = await booksService.updateBook(testBookId, updateData);

      expect(result.modifiedCount).toBe(1);

      const updatedBook = await booksService.getBookById(testBookId);
      expect(updatedBook.titre).toBe('Updated Book Title');
      expect(updatedBook.auteur).toBe('Updated Author');
      expect(updatedBook.année).toBe(2024);
      expect(updatedBook.genre).toBe('Science Fiction');
    });

    it('should update book and add genre if not present', async () => {
      const bookDataWithoutGenre = {
        titre: 'Book Without Genre',
        auteur: 'Author',
        année: '2020',
        genre: ''
      };

      const createResult = await booksService.createBook(bookDataWithoutGenre);
      const bookId = createResult.insertedId.toString();

      const updateData = {
        titre: 'Book Without Genre',
        auteur: 'Author',
        année: '2020',
        genre: 'Thriller'
      };

      await booksService.updateBook(bookId, updateData);

      const updatedBook = await booksService.getBookById(bookId);
      expect(updatedBook.genre).toBe('Thriller');

      await booksService.deleteBook(bookId);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      const bookData = {
        titre: 'Book To Delete',
        auteur: 'Test Author',
        année: '2023',
        genre: 'Fiction'
      };

      const createResult = await booksService.createBook(bookData);
      const bookId = createResult.insertedId.toString();

      const deleteResult = await booksService.deleteBook(bookId);

      expect(deleteResult.deletedCount).toBe(1);

      const deletedBook = await booksService.getBookById(bookId);
      expect(deletedBook).toBeNull();
    });
  });

  describe('getBookById', () => {
    let testBookId;

    beforeEach(async () => {
      const bookData = {
        titre: 'Book To Find',
        auteur: 'Test Author',
        année: '2023',
        genre: 'Fiction'
      };

      const result = await booksService.createBook(bookData);
      testBookId = result.insertedId.toString();
    });

    afterEach(async () => {
      if (testBookId) {
        await booksService.deleteBook(testBookId);
        testBookId = null;
      }
    });

    it('should find a book by ID', async () => {
      const book = await booksService.getBookById(testBookId);

      expect(book).toBeDefined();
      expect(book.titre).toBe('Book To Find');
      expect(book.auteur).toBe('Test Author');
    });

    it('should return null for non-existent ID', async () => {
      const book = await booksService.getBookById('507f1f77bcf86cd799439011');

      expect(book).toBeNull();
    });
  });

  describe('Exercice 2 - Validation tests', () => {
    let createdBookIds = [];

    afterEach(async () => {
      for (const id of createdBookIds) {
        try {
          await booksService.deleteBook(id);
        } catch (e) {
          // Ignore si le livre n'existe pas
        }
      }
      createdBookIds = [];
    });

    it('should successfully insert "Harry Potter à l\'école des sorciers"', async () => {
      const bookData = {
        titre: 'Harry Potter à l\'école des sorciers',
        auteur: 'J. K. Rowling',
        année: '2001',
        genre: 'Fantasy'
      };

      const result = await booksService.createBook(bookData);
      expect(result.acknowledged).toBe(true);
      createdBookIds.push(result.insertedId.toString());

      const book = await booksService.getBookById(result.insertedId.toString());
      expect(book.titre).toBe('Harry Potter à l\'école des sorciers');
      expect(book.auteur).toBe('J. K. Rowling');
      expect(book.année).toBe(2001);
      expect(book.genre).toBe('Fantasy');
    });

    it('should successfully insert "Harry Potter et la chambre des secrets"', async () => {
      const bookData = {
        titre: 'Harry Potter et la chambre des secrets',
        auteur: 'J. K. Rowling',
        année: '2002',
        genre: 'Fantasy'
      };

      const result = await booksService.createBook(bookData);
      expect(result.acknowledged).toBe(true);
      createdBookIds.push(result.insertedId.toString());

      const book = await booksService.getBookById(result.insertedId.toString());
      expect(book.titre).toBe('Harry Potter et la chambre des secrets');
      expect(book.année).toBe(2002);
    });

    it('should reject book with year <= 1900 ("Livre vieux, Auteur inconnu, 1800")', async () => {
      const bookData = {
        titre: 'Livre vieux',
        auteur: 'Auteur inconnu',
        année: '1800'
      };

      await expect(booksService.createBook(bookData)).rejects.toThrow('L\'année doit être supérieure à 1900');
    });

    it('should reject duplicate title ("Harry Potter à l\'école des sorciers, Copycat, 2012")', async () => {
      const firstBook = {
        titre: 'Harry Potter à l\'école des sorciers',
        auteur: 'J. K. Rowling',
        année: '2001',
        genre: 'Fantasy'
      };

      const result1 = await booksService.createBook(firstBook);
      createdBookIds.push(result1.insertedId.toString());

      const duplicateBook = {
        titre: 'Harry Potter à l\'école des sorciers',
        auteur: 'Copycat',
        année: '2012',
        genre: 'Fantasy'
      };

      await expect(booksService.createBook(duplicateBook)).rejects.toThrow();
    });

    it('should reject empty author', async () => {
      const bookData = {
        titre: 'Livre sans auteur',
        auteur: '',
        année: '2020'
      };

      await expect(booksService.createBook(bookData)).rejects.toThrow('L\'auteur est requis et ne peut pas être vide');
    });

    it('should reject empty title', async () => {
      const bookData = {
        titre: '',
        auteur: 'Auteur sans titre',
        année: '2020'
      };

      await expect(booksService.createBook(bookData)).rejects.toThrow('Le titre est requis');
    });
  });
});
