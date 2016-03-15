'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', require('./routes/base'));
app.use('/delays', require('./routes/delays'));

let server = app.listen(8080, () => {
  console.log(`Listening on port ${server.address().port}`);
});
