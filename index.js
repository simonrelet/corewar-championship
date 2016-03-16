'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const delays = require('./routes/delays');

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', delays);

let server = app.listen(80, () => {
  console.log(`Listening on port ${server.address().port}`);
});
