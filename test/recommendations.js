/* eslint-disable quotes */

const app = require('../index.js');
const request = require('supertest')(app);

function ok(expression, message) {
  if (!expression) throw new Error(message);
}

describe('Recommendations API', function() {
  it('has param defaults', function(done) {
    request
      .get('/films/38/recommendations')
      .expect('Content-Type', /json/)
      .expect(200,
        {
          recommendations: [
            {
              id: 1164,
              title: "Shang Chi Biologist",
              releaseDate: "1980-05-02",
              genre: "Thriller",
              directors: [ "Nicola Brown" ],
              averageRating: 4.375,
              reviews: 8
            }, {
              id: 9136,
              title: "Agent Binary Librarian",
              releaseDate: "2000-11-17",
              genre: "Mystery",
              directors: [ "Nicola Brown" ],
              averageRating: 4.5,
              reviews: 4
            }
          ],
          meta: {
            limit: 10,
            offset: 0
          }
        }, done);
  });

  describe('pagination', function() {
    it('can limit results', function(done) {
      request
        .get('/films/38/recommendations?limit=1')
        .expect('Content-Type', /json/)
        .expect(200, {
          recommendations: [
            {
              id: 1164,
              title: "Shang Chi Biologist",
              releaseDate: "1980-05-02",
              genre: "Thriller",
              directors: [ "Nicola Brown" ],
              averageRating: 4.375,
              reviews: 8
            }
          ],
          meta: {
            limit: 1,
            offset: 0
          }
        }, done);
    });

    it('can offset results', function(done) {
      request
        .get('/films/38/recommendations?offset=1')
        .expect('Content-Type', /json/)
        .expect(200, {
          recommendations: [
            {
              id: 9136,
              title: "Agent Binary Librarian",
              releaseDate: "2000-11-17",
              genre: "Mystery",
              directors: [ "Nicola Brown" ],
              averageRating: 4.5,
              reviews: 4
            }
          ],
          meta: {
            limit: 10,
            offset: 1
          }
        }, done);
    });
  });

  describe('error handling', function() {
    it('handles missing routes', function(done) {
      request
        .get('/films/1/recommendations/notarealroute')
        .expect(404)
        .expect(function(res) {
          ok('message' in res.body, '"message" key missing');
        }).end(done);
    });

    it('handles invalid id', function(done) {
      request
        .get('/films/notanid/recommendations')
        .expect(422)
        .expect(function(res) {
          ok('message' in res.body, '"message" key missing');
        }).end(done);
    });

    it('handles invalid query params', function(done) {
      request
        .get('/films/19/recommendations?offset=notanoffset&limit=notalimit')
        .expect(422)
        .expect(function(res) {
          ok('message' in res.body, '"message" key missing');
        }).end(done);
    });
  });
});
