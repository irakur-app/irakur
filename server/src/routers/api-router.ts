/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import express from 'express';
const apiRouter = express.Router();

import { homeRouter } from './home-router';
import { settingsRouter } from './settings-router';
import { languagesRouter } from './languages-router';
import { textsRouter } from './texts-router';

apiRouter.use('/home', homeRouter);
apiRouter.use('/settings/', settingsRouter);
apiRouter.use('/languages/', languagesRouter);
apiRouter.use('/texts/', textsRouter);

export { apiRouter };