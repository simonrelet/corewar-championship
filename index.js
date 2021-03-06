'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const constants = require('./app/constants');

app.set('view engine', 'jade');
app.use(express.static('dist/public'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use('/', require('./routes/home'));
app.use('/instruction-set', require('./routes/instruction-set'));
app.use('/leaderboard', require('./routes/leaderboard'));
app.use('/delays', require('./routes/delays'));

let server = app.listen(constants.config.port, () => {
  console.log(`Listening on port ${server.address().port}`);
});
