/* 
 * Lingua Immerse - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/settingsController');

const settingsController = new SettingsController();

router.get('/', settingsController.renderSettings.bind(settingsController));

module.exports = router;