const app = require('express')();

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'));
console.log('Listening on port', app.get('port'));
