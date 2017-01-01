// 1. Store into MongoDB
// 2. Redirect to URL
// 3. Do it for real
const app = require('express')();
const mongo = require('mongodb').MongoClient;
const dbURL = 'mongodb://localhost:27017/free_code_camp';

app
  .set('port', process.env.PORT || 3000)
  .get('/:url', (req,res) => {
    mongo.connect(dbURL, (err, db) => {
      let errMsg;

      if (err) {
        errMsg = 'Couldn\'t connect to the database!';
      } else {
        result = db.collection('shortened_urls').insert({url: req.params.url});
        if (result.writeError) {
          errMsg = 'Couldn\'t write to the database!';
        }
      }

      if (errMsg) {
        res.writeHead(500);
        console.error('Something went wrong:', errMsg);
      } else {
        console.log('Successfully inserted url', req.params.url);
      }

      res.end(errMsg || 'You\'re good!');
    });
  })
  .listen(app.get('port'));

console.log('Listening on port', app.get('port'));
