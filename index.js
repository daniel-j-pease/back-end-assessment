const sqlite = require('sqlite'),
      Sequelize = require('sequelize'),
      express = require('express'),
      app = express();

const { testFunc, selectStuff } = require('./models/movies.js')

const { PORT=3000, NODE_ENV='development', DB_PATH='./db/database.db' } = process.env;

const db = new Sequelize('main', 'null', 'null', {
  dialect: 'sqlite',
  port: 3306,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: '/Users/Daniel_Pease/Desktop/FreshPotatoes-master/db/database.db',
});

// START SERVER
Promise.resolve()
  .then(() => app.listen(PORT, () => console.log(`App listening on port ${PORT}`)))
  .catch((err) => { if (NODE_ENV === 'development') console.error(err.stack); });

// ROUTES
app.get('/films/:id/recommendations/:limit', getFilmRecommendations, (req, res) => res.json(res.response));

// ROUTE HANDLER
function getFilmRecommendations(req, res, next) {
  db.query(
    `SELECT * FROM films
    LEFT JOIN genres ON films.genre_id = genres.id
    LEFT JOIN artist_films ON films.id = artist_films.film_id
    WHERE films.id = ${req.params.id}
    LIMIT ${req.params.limit}`,
    {type:Sequelize.QueryTypes.Select})
    .then((data) => {
      console.log(data)
      res.response = data
      next();
    })
  .catch(err => {
    console.log(err);
    next();
  })

}

module.exports = app;
