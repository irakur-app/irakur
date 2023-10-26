const express = require('express');
const router = express.Router();
const LanguagesController = require('../controllers/languagesController');

const languagesController = new LanguagesController();

router.get('/', languagesController.renderLanguages.bind(languagesController));
router.get('/add', languagesController.renderAddLanguage.bind(languagesController));
router.post('/add', languagesController.addLanguage.bind(languagesController));

module.exports = router;