const express = require('express');
const path = require('path');
const { connect, disconnect } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const gamesRouter = require('./routes/games');
const booksRouter = require('./routes/books');

app.use('/games', gamesRouter);
app.use('/books', booksRouter);

app.get('/', (req, res) => {
  res.redirect('/books');
});

async function startServer() {
  try {
    await connect();
    console.log('Connexion à MongoDB établie');

    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\nArrêt du serveur...');
  await disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nArrêt du serveur...');
  await disconnect();
  process.exit(0);
});

startServer();
