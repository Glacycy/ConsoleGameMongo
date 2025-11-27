const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'livre';

class BooksService {
  getAllBooks() {
    const db = getDb();
    return db.collection(COLLECTION_NAME).find().toArray();
  }

  async createBook(bookData) {
    const db = getDb();

    if (!bookData.titre || bookData.titre.trim() === '') {
      throw new Error('Le titre est requis');
    }

    if (!bookData.auteur || bookData.auteur.trim() === '') {
      throw new Error('L\'auteur est requis et ne peut pas être vide');
    }

    const année = parseInt(bookData.année);
    if (isNaN(année)) {
      throw new Error('L\'année doit être un nombre valide');
    }

    if (année <= 1900) {
      throw new Error('L\'année doit être supérieure à 1900');
    }

    const book = {
      titre: bookData.titre.trim(),
      auteur: bookData.auteur.trim(),
      année: année
    };

    if (bookData.genre && bookData.genre.trim() !== '') {
      book.genre = bookData.genre.trim();
    }

    const result = await db.collection(COLLECTION_NAME).insertOne(book);
    return result;
  }

  async createManyBooks(booksData) {
    const db = getDb();

    if (!Array.isArray(booksData) || booksData.length === 0) {
      throw new Error('Un tableau de livres non vide est requis');
    }

    const validatedBooks = booksData.map((bookData, index) => {
      if (!bookData.titre || bookData.titre.trim() === '') {
        throw new Error(`Le titre est requis pour le livre à l'index ${index}`);
      }

      if (!bookData.auteur || bookData.auteur.trim() === '') {
        throw new Error(`L'auteur est requis pour le livre à l'index ${index}`);
      }

      const année = parseInt(bookData.année);
      if (isNaN(année)) {
        throw new Error(`L'année doit être un nombre valide pour le livre à l'index ${index}`);
      }

      if (année <= 1900) {
        throw new Error(`L'année doit être supérieure à 1900 pour le livre à l'index ${index}`);
      }

      const book = {
        titre: bookData.titre.trim(),
        auteur: bookData.auteur.trim(),
        année: année
      };

      if (bookData.genre && bookData.genre.trim() !== '') {
        book.genre = bookData.genre.trim();
      }

      return book;
    });

    const result = await db.collection(COLLECTION_NAME).insertMany(validatedBooks);
    return result;
  }

  async updateBook(id, bookData) {
    const db = getDb();

    if (!bookData.titre || bookData.titre.trim() === '') {
      throw new Error('Le titre est requis');
    }

    if (!bookData.auteur || bookData.auteur.trim() === '') {
      throw new Error('L\'auteur est requis et ne peut pas être vide');
    }

    const année = parseInt(bookData.année);
    if (isNaN(année)) {
      throw new Error('L\'année doit être un nombre valide');
    }

    if (année <= 1900) {
      throw new Error('L\'année doit être supérieure à 1900');
    }

    const updateData = {
      titre: bookData.titre.trim(),
      auteur: bookData.auteur.trim(),
      année: année
    };

    if (bookData.genre && bookData.genre.trim() !== '') {
      updateData.genre = bookData.genre.trim();
    }

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return result;
  }

  async deleteBook(id) {
    const db = getDb();
    const result = await db.collection(COLLECTION_NAME).deleteOne({
      _id: new ObjectId(id)
    });
    return result;
  }

  async deleteBookByTitle(titre) {
    const db = getDb();

    if (!titre || titre.trim() === '') {
      throw new Error('Le titre est requis pour la suppression');
    }

    const result = await db.collection(COLLECTION_NAME).deleteOne({
      titre: titre.trim()
    });
    return result;
  }

  async deleteBooksByAuthor(auteur) {
    const db = getDb();

    if (!auteur || auteur.trim() === '') {
      throw new Error('L\'auteur est requis pour la suppression');
    }

    const result = await db.collection(COLLECTION_NAME).deleteMany({
      auteur: auteur.trim()
    });
    return result;
  }

  async getBookById(id) {
    const db = getDb();
    return db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  }
}

module.exports = new BooksService();
