const express = require('express');
const router = express.Router();
const {
  getProblems,
  getProblemById,
  getVisualizationById
} = require('../controllers/problemsController');

router.get('/problems', getProblems);
router.get('/problem/:id', getProblemById);
router.get('/visualization/:id', getVisualizationById);

module.exports = router;
