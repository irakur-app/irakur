/* 
 * Lingua Immerse - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const express = require('express');
const router = express.Router();

router.use('/home', require('./homeRouter'));
router.use('/settings/', require('./settingsRouter'));
router.use('/languages/', require('./languagesRouter'));
router.use('/texts/', require('./textsRouter'));

module.exports = router;