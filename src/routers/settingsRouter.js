const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/settingsController');

const settingsController = new SettingsController();

router.get('/', settingsController.renderSettings.bind(settingsController));

module.exports = router;