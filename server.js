// 1. Store into MongoDB
// 2. Redirect to URL
// 3. Do it for real
const app = require('express')();
const mongo = require('mongodb').MongoClient;
const dbURL = 'mongodb://localhost:27017/free_code_camp';

app
  .set('port', process.env.PORT || 3000)

  .get('/new/:url', (req,res) => mongo.connect(dbURL)
    .then(db => db.collection('shortened_urls').insert({
      url: req.params.url,
      shortened: shortenUrl(req.params.url)
    }))
    .then(result => {
      if (result.writeError) return Promise.reject(result.writeError.errmsg);
      res.end(JSON.stringify({
        url: result.ops[0].url, short_url: result.ops[0].shortened
      }));
    })
    .catch(err => {
      res.writeHead(500);
      console.error('Something went wrong:', err);
      res.end(err);
    })
  )

  .get('/:shortURL', (req, res) => mongo.connect(dbURL)
    .then(db => db.collection('shortened_urls').findOne({
      shortened: req.params.shortURL
    }))
    .then(document => {
      if (!document) return Promise.reject('Couldn\'t find the requested url!');
      console.log('Successfully fetched url', document.url);
      res.end(document.url);
    })
    .catch(err => {
      res.writeHead(500);
      console.error('Something went wrong:', err);
      res.end(err);
    })
  )

  .listen(app.get('port'));

console.log('Listening on port', app.get('port'));

function shortenUrl(url) {
  let hash = 0, chr;
  if (url.length === 0) return hash;
  for (i = 0; i < url.length; i++) {
    chr = url.charCodeAt(i);
    hash = ((hash<<5)-hash)+chr;
    hash &= hash; // Convert to 32bit integer
  }
  return (hash >>> 0).toString(16);
}
