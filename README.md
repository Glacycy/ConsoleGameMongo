# Console Games - Node.js MongoDB Exercise

Application web de gestion de jeux vidéo et de livres utilisant Node.js, Express, MongoDB et EJS.

## Description

Ce projet est un exercice de cours Node.js comprenant deux composants principaux :

1. **Exercices MongoDB** : Composition de requêtes sur un dataset de ventes de jeux vidéo
2. **Application Web Express** : Système de gestion de livres et jeux avec opérations CRUD

## Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (v7.0 ou supérieur)
- npm ou yarn

## Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd consolegames
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer MongoDB

Assurez-vous que MongoDB est installé et en cours d'exécution sur `mongodb://127.0.0.1:27017`

### 4. Importer les données

```bash
mongoimport --db consolegame --collection consolegame --file console_games.json
```

## Utilisation

### Démarrer l'application

```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

### Routes disponibles

#### Books (Livres)
- `GET /` ou `GET /books` - Liste tous les livres
- `POST /books/add` - Ajouter un nouveau livre
- `POST /books/update/:id` - Mettre à jour un livre
- `POST /books/delete/:id` - Supprimer un livre

#### Games (Jeux vidéo)
- `GET /games` - Liste tous les jeux (100 max)
- `GET /games/:platform` - Filtrer par plateforme (ex: `/games/3DS`)
- `GET /games/:platform/:year` - Filtrer par plateforme et année
- `GET /games/:platform/:year/top3` - Top 3 des jeux par ventes

## Structure du projet

```
src/
  config/
    db.js                 # Module de connexion MongoDB (singleton)
  controllers/
    games.controller.js   # Contrôleur des jeux
    books.controller.js   # Contrôleur des livres
  services/
    games.service.js      # Logique métier des jeux
    books.service.js      # Logique métier des livres
  routes/
    games.js              # Définition des routes jeux
    books.js              # Définition des routes livres
  index.js                # Point d'entrée Express
  queries.js              # Fonctions de requêtes (legacy)

views/
  index.ejs               # Interface CRUD des livres

tests/
  queries.test.js         # Tests unitaires Jest
  db.test.js              # Tests de la base de données
  controllers/            # Tests des contrôleurs
  services/               # Tests des services

cypress/
  e2e/                    # Tests end-to-end Cypress
```

## Architecture

Le projet suit une **architecture MVC en couches** :

1. **Database Layer** (`config/db.js`) - Gestion de connexion (Singleton)
2. **Service Layer** (`services/`) - Logique métier et accès aux données
3. **Controller Layer** (`controllers/`) - Gestion des requêtes/réponses HTTP
4. **Route Layer** (`routes/`) - Définition des endpoints
5. **View Layer** (`views/`) - Templates EJS

## Tests

### Tests unitaires (Jest)

```bash
npm test                    # Exécuter les tests
npm run test:coverage       # Avec rapport de couverture
```

### Tests E2E (Cypress)

```bash
npm run test:e2e            # Tests E2E avec PM2 et Cypress
npm run cypress:run         # Cypress uniquement
```

## Schéma des données

### Collection `consolegame`

Données de ventes de jeux vidéo :

- `Name` : Titre du jeu
- `Platform` : Plateforme (Wii, DS, 3DS, GB, NES, etc.)
- `Year` : Année de sortie (string)
- `Genre` : Genre du jeu
- `Publisher` : Éditeur
- `NA_Sales` : Ventes Amérique du Nord (millions)
- `EU_Sales` : Ventes Europe (millions)
- `JP_Sales` : Ventes Japon (millions)
- `Other_Sales` : Ventes autres régions (millions)
- `Global_Sales` : Ventes mondiales totales (millions)

### Collection `livre`

Données de gestion de livres :

- `titre` : Titre du livre (requis, unique)
- `auteur` : Nom de l'auteur (requis)
- `année` : Année de publication (requis, > 1900)
- `genre` : Genre du livre (optionnel)

Chaque exercice contient :
1. Description des opérations requises
2. Complexité progressive des requêtes
3. Filtres, projections, tris et limites

## Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express 5.1.0** - Framework web
- **MongoDB 7.0.0** - Base de données NoSQL
- **EJS 3.1.10** - Moteur de templates
- **Jest** - Tests unitaires
- **Cypress 15.7.0** - Tests E2E
- **PM2** - Gestionnaire de processus
