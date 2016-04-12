'use strict';

const express = require('express');
const router = express.Router();
const utilities = require('../app/utilities');
const constants = require('../app/constants');

router.get('/', (req, res) => {
  res.render('home', utilities.createViewData({
    pageTitle: constants.pages.home.name,
    page: constants.pages.home.id
  }));
});

module.exports = router;
