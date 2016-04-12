'use strict';

const express = require('express');
const router = express.Router();
const instructions = require('../db/instructions.json');
const utilities = require('../app/utilities');
const constants = require('../app/constants');

let getData = (req, current, sibling) => {
  return utilities.createViewData({
    pageTitle: constants.pages.delays[current].name,
    page: 'delays',
    params: {
      current: {
        name: current,
        capitalizedName: constants.pages.delays[current].name
      },
      sibling: {
        link: `${req.baseUrl}/${sibling}`,
        name: sibling
      },
      instructions: instructions
    }
  });
};

let renderTable = (req, res, current, sibling) => {
  res.render(`instruction-tables`, getData(req, current, sibling));
};

router.get('/', (req, res) => {
  res.redirect(`${req.baseUrl}/decode`);
});

router.get('/decode', (req, res) => {
  renderTable(req, res, 'decode', 'execute');
});

router.get('/execute', (req, res) => {
  renderTable(req, res, 'execute', 'decode');
});

module.exports = router;
