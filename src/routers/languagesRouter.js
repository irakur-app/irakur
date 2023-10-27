const express = require('express');
const router = express.Router();
const LanguagesController = require('../controllers/languagesController');

const languagesController = new LanguagesController();

router.get('/', languagesController.renderLanguages.bind(languagesController));
router.get('/add', languagesController.renderAddLanguage.bind(languagesController));
router.get('/edit/:id', languagesController.renderEditLanguage.bind(languagesController));
router.post('/add', languagesController.addLanguage.bind(languagesController));
router.post('/delete', languagesController.deleteLanguage.bind(languagesController));
router.post('/edit', languagesController.editLanguage.bind(languagesController));
router.post('/setActive', languagesController.setActiveLanguage.bind(languagesController));

module.exports = router;