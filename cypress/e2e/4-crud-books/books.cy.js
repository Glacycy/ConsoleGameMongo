describe('Books CRUD', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/books');
  });

  it('should display the books page', () => {
    cy.contains('h1', 'Gestion des Livres');
    cy.contains('Base de données de la bibliothèque');
  });

  it('should display the add book form', () => {
    cy.get('form[action="/books/add"]').should('exist');
    cy.get('input[name="titre"]').should('exist');
    cy.get('input[name="auteur"]').should('exist');
    cy.get('input[name="année"]').should('exist');
    cy.get('input[name="genre"]').should('exist');
    cy.get('button[type="submit"]').contains('Ajouter le livre');
  });

  it('should create a new book with all fields', () => {
    const testBook = {
      titre: `Test Book ${Date.now()}`,
      auteur: 'Test Author',
      année: '2023',
      genre: 'Fiction'
    };

    cy.get('input[name="titre"]').type(testBook.titre);
    cy.get('input[name="auteur"]').type(testBook.auteur);
    cy.get('input[name="année"]').type(testBook.année);
    cy.get('input[name="genre"]').type(testBook.genre);

    cy.get('form[action="/books/add"] button[type="submit"]').click();

    cy.contains('.success', 'Livre ajouté avec succès!');
    cy.contains('td', testBook.titre).should('exist');

    cy.contains('td', testBook.titre)
      .parent('tr')
      .within(() => {
        cy.contains('button', 'Supprimer').click();
      });

    cy.contains('.success', 'Livre supprimé avec succès!');
  });

  it('should create a new book without optional genre', () => {
    const testBook = {
      titre: `Book Without Genre ${Date.now()}`,
      auteur: 'Test Author',
      année: '2023'
    };

    cy.get('input[name="titre"]').type(testBook.titre);
    cy.get('input[name="auteur"]').type(testBook.auteur);
    cy.get('input[name="année"]').type(testBook.année);

    cy.get('form[action="/books/add"] button[type="submit"]').click();

    cy.contains('.success', 'Livre ajouté avec succès!');
    cy.contains('td', testBook.titre).should('exist');

    cy.contains('td', testBook.titre)
      .parent('tr')
      .within(() => {
        cy.get('td').eq(3).should('contain', '-');
        cy.contains('button', 'Supprimer').click();
      });
  });

  it('should delete a book', () => {
    const testBook = {
      titre: `Book to Delete ${Date.now()}`,
      auteur: 'Test Author',
      année: '2023',
      genre: 'Drama'
    };

    cy.get('input[name="titre"]').type(testBook.titre);
    cy.get('input[name="auteur"]').type(testBook.auteur);
    cy.get('input[name="année"]').type(testBook.année);
    cy.get('input[name="genre"]').type(testBook.genre);

    cy.get('form[action="/books/add"] button[type="submit"]').click();

    cy.contains('td', testBook.titre).should('exist');

    cy.contains('td', testBook.titre)
      .parent('tr')
      .within(() => {
        cy.contains('button', 'Supprimer').click();
      });

    cy.contains('.success', 'Livre supprimé avec succès!');
    cy.contains('td', testBook.titre).should('not.exist');
  });

  it('should display books table with correct columns when books exist', () => {
    const testBook = {
      titre: `Book for Table ${Date.now()}`,
      auteur: 'Test Author',
      année: '2023',
      genre: 'Test'
    };

    cy.get('input[name="titre"]').clear().type(testBook.titre);
    cy.get('input[name="auteur"]').clear().type(testBook.auteur);
    cy.get('input[name="année"]').clear().type(testBook.année);
    cy.get('input[name="genre"]').clear().type(testBook.genre);

    cy.get('form[action="/books/add"] button[type="submit"]').click();

    cy.get('.books-table thead th', { timeout: 10000 }).should('have.length', 5);
    cy.get('.books-table thead').within(() => {
      cy.contains('th', 'Titre');
      cy.contains('th', 'Auteur');
      cy.contains('th', 'Année');
      cy.contains('th', 'Genre');
      cy.contains('th', 'Actions');
    });

    cy.contains('td', testBook.titre)
      .parent('tr')
      .within(() => {
        cy.contains('button', 'Supprimer').click();
      });
  });

  it('should validate required fields', () => {
    cy.get('form[action="/books/add"] button[type="submit"]').click();

    cy.get('input[name="titre"]:invalid').should('exist');
    cy.get('input[name="auteur"]:invalid').should('exist');
    cy.get('input[name="année"]:invalid').should('exist');
  });

  it('should validate year minimum value', () => {
    cy.get('input[name="année"]').should('have.attr', 'min', '1901');
  });

  it('should display error message on failure', () => {
    const testBook = {
      titre: 'Test Book',
      auteur: 'Test Author',
      année: '1800'
    };

    cy.get('input[name="titre"]').type(testBook.titre);
    cy.get('input[name="auteur"]').type(testBook.auteur);
    cy.get('input[name="année"]').invoke('val', testBook.année);

    cy.get('form[action="/books/add"] button[type="submit"]').click();
  });

  it('should display genre as optional in form', () => {
    cy.get('input[name="genre"]').should('have.attr', 'placeholder', 'Optionnel');
    cy.get('input[name="genre"]').should('not.have.attr', 'required');
  });

  it('should display all book information in table', () => {
    const testBook = {
      titre: `Complete Book ${Date.now()}`,
      auteur: 'Complete Author',
      année: '2023',
      genre: 'Complete Genre'
    };

    cy.get('input[name="titre"]').type(testBook.titre);
    cy.get('input[name="auteur"]').type(testBook.auteur);
    cy.get('input[name="année"]').type(testBook.année);
    cy.get('input[name="genre"]').type(testBook.genre);

    cy.get('form[action="/books/add"] button[type="submit"]').click();

    cy.contains('td', testBook.titre)
      .parent('tr')
      .within(() => {
        cy.contains('td', testBook.titre);
        cy.contains('td', testBook.auteur);
        cy.contains('td', testBook.année);
        cy.contains('td', testBook.genre);
        cy.contains('button', 'Supprimer');
      });

    cy.contains('td', testBook.titre)
      .parent('tr')
      .within(() => {
        cy.contains('button', 'Supprimer').click();
      });
  });

  it('should have proper form styling and labels', () => {
    cy.get('.add-form h2').should('contain', 'Ajouter un livre');

    cy.contains('label', 'Titre').should('exist');
    cy.contains('label', 'Auteur').should('exist');
    cy.contains('label', 'Année').should('exist');
    cy.contains('label', 'Genre').should('exist');

    cy.get('input[name="titre"]').should('have.attr', 'required');
    cy.get('input[name="auteur"]').should('have.attr', 'required');
    cy.get('input[name="année"]').should('have.attr', 'required');
  });
});
