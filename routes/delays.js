'use strict';

const express = require('express');
const router = express.Router();
const instructions = require('../db/instructions.json');

const VIEWS_ROOT = 'instruction-tables';

let getData = (req, title) => {
  return {
    title: `${title} Delay`,
    baseUrl: req.baseUrl,
    instructions: instructions
  };
};

router.get('/', (req, res) => {
  res.redirect('decode');
});

router.get('/decode', (req, res) => {
  res.render(`${VIEWS_ROOT}/decode-table`, getData(req, 'Decode'));
});

router.get('/execute', (req, res) => {
  res.render(`${VIEWS_ROOT}/execute-table`, getData(req, 'Execute'));
});

module.exports = router;
