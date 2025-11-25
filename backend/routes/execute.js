const express = require('express');
const router = express.Router();
const { execute } = require('../controllers/executeController');

router.post('/execute', execute);

module.exports = router;
