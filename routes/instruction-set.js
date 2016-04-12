'use strict';

const express = require('express');
const router = express.Router();
const utilities = require('../app/utilities');
const constants = require('../app/constants');

router.get('/', (req, res) => {
  res.render('instruction-set', utilities.createViewData({
    pageTitle: constants.pages.instructionSet.name,
    page: constants.pages.instructionSet.id
  }));
});

module.exports = router;
