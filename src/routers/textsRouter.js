const express = require('express');
const router = express.Router();
const TextsController = require('../controllers/textsController');

const textsController = new TextsController();

router.get('/', textsController.renderTexts.bind(textsController));

module.exports = router;