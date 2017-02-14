const sqlite = require('sqlite'),
      Sequelize = require('sequelize'),
      express = require('express'),
      app = express();

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
app.get('/films/:id/recommendations/:limit', getFilmInfo, getFilmRecommendations, (req, res, next) => res.json(res.test));

// ROUTE HANDLER

function getFilmInfo(req, res, next) {
  db.query(
    `SELECT * FROM films
    WHERE films.id = ${req.params.id}`,
    {type:Sequelize.QueryTypes.Select})
    .then((data) => {
      data.limit = `${req.params.limit}`
      console.log('data', data)
      res.test = data
      getFilmRecommendations(data);
    })
  .catch(err => {
    console.log(err);
    next();
  })
}

function getFilmRecommendations(req, res, next) {
  let query = req[0][0]
  console.log('query', query)
  db.query(
    `SELECT * FROM films
    LEFT JOIN genres ON films.genre_id = genres.id
    LEFT JOIN artist_films ON films.id = artist_films.film_id
    WHERE ${query.genre_id} = genres.id
    LIMIT ${req.limit}`,
    {type:Sequelize.QueryTypes.Select})
    .then((response) => {
      console.log('res',response)
    })
  .catch(err => {
    console.log(err);
  })
}

module.exports = app;
