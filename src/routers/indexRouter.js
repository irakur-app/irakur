const express = require('express');
const router = express.Router();
var IndexController = require('../controllers/indexController');

var indexController = new IndexController();

router.get('/', indexController.renderIndex.bind(indexController));

module.exports = router;