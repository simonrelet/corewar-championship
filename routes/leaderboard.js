'use strict';

const express = require('express');
const router = express.Router();
const utilities = require('../app/utilities');
const constants = require('../app/constants');
const rp = require('request-promise');

let renderScores = res => {
  return scores => {
    res.render('leaderboard', utilities.createViewData({
      pageTitle: constants.pages.leaderboard.name,
      page: constants.pages.leaderboard.id,
      scores: scores
    }));
  };
};

router.get('/', (req, res) => {
  let options = {
    uri: constants.config.leaderboardUrl,
    json: true
  };
  rp(options)
    .then(renderScores(res))
    .catch(() => renderScores(res)([]));
});

module.exports = router;
