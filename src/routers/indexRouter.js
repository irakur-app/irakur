/* 
 * Lingua Immerse - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const express = require('express');
const router = express.Router();
const IndexController = require('../controllers/indexController');

const indexController = new IndexController();

router.get('/', indexController.renderIndex.bind(indexController));

module.exports = router;