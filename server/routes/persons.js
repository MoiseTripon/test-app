module.exports = app => {
  'use strict';
  const express      = require('express');
  const personsCtrl  = require('../controllers/personsCtrl')(app.locals.db);
  const router       = express.Router();

  router.post('/', personsCtrl.create);
  router.put('/', personsCtrl.update);
  router.get('/', personsCtrl.findAll);
  router.get('/:id', personsCtrl.find);
  router.delete('/:id', personsCtrl.destroy);

  return router;
};