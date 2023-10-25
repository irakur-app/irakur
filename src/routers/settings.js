const express = require('express');
const router = express.Router();
var SettingsController = require('../controllers/settings');

var settingsController = new SettingsController();

router.get('/', settingsController.renderSettings.bind(settingsController));

module.exports = router;