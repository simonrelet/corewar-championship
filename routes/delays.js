'use strict';

const express = require('express');
const router = express.Router();
const _ = require('lodash');
const instructions = require('../db/instructions.json');
const VERSION = require('../package.json').version;

let getData = (req, current, sibling) => {
  console.log(`VERSION=${VERSION}`);
  let currentCapitalized = _.capitalize(current);
  return {
    page: `${currentCapitalized} Delays`,
    version: VERSION,
    params: {
      current: {
        name: current,
        capitalizedName: currentCapitalized
      },
      sibling: {
        link: `${req.baseUrl}/${sibling}`,
        name: sibling
      },
      instructions: instructions
    }
  };
};

let renderTable = (req, res, current, sibling) => {
  res.render(`instruction-tables`, getData(req, current, sibling));
};

router.get('/', (req, res) => {
  res.redirect('decode');
});

router.get('/decode', (req, res) => {
  renderTable(req, res, 'decode', 'execute');
});

router.get('/execute', (req, res) => {
  renderTable(req, res, 'execute', 'decode');
});

module.exports = router;
