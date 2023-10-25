const express = require('express');
const router = express.Router();
const IndexController = require('../controllers/indexController');

const indexController = new IndexController();

router.get('/', indexController.renderIndex.bind(indexController));

module.exports = router;