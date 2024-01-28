/* 
 * Lingua Immerse - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/homeController');

const homeController = new HomeController();

router.get('/', homeController.renderHome.bind(homeController));

module.exports = router;