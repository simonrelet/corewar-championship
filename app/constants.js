'use strict';

const config = require('./config.json');
const defaultConfig = {
  port: 8080,
  leaderboardUrl: 'http://localhost:4202/leaderboard'
};

module.exports = {
  config: Object.assign(defaultConfig, config),
  pages: {
    home: {
      name: 'Home',
      id: 'home'
    },
    instructionSet: {
      name: 'Instruction Set',
      id: 'instruction-set'
    },
    leaderboard: {
      name: 'Leaderboard',
      id: 'leaderboard'
    },
    delays: {
      decode: {
        name: 'Decode',
        id: 'decode'
      },
      execute: {
        name: 'Execute',
        id: 'execute'
      }
    }
  }
};
