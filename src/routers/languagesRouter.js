const express = require('express');
const router = express.Router();
const LanguagesController = require('../controllers/languagesController');

const languagesController = new LanguagesController();

router.get('/', languagesController.renderLanguages.bind(languagesController));

module.exports = router;