/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import express from 'express';
const settingsRouter = express.Router();
import { SettingsController } from '../controllers/settings-controller';

const settingsController = new SettingsController();

settingsRouter.get('/', settingsController.renderSettings.bind(settingsController));

export { settingsRouter };