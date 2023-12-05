const express = require('express');
const router = express.Router();
const TextsController = require('../controllers/textsController');

const textsController = new TextsController();

router.get('/', textsController.renderTexts.bind(textsController));
router.get('/add', textsController.renderAddText.bind(textsController));
router.post('/add', textsController.addText.bind(textsController));
router.post('/delete', textsController.deleteText.bind(textsController));

module.exports = router;