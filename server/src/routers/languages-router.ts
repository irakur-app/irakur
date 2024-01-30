/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import express from 'express';
const languagesRouter = express.Router();
import { LanguagesController } from '../controllers/languages-controller';

const languagesController = new LanguagesController();

languagesRouter.get('/', languagesController.renderLanguages.bind(languagesController));
languagesRouter.get('/add', languagesController.renderAddLanguage.bind(languagesController));
languagesRouter.get('/edit/:id', languagesController.renderEditLanguage.bind(languagesController));
languagesRouter.post('/add', languagesController.addLanguage.bind(languagesController));
languagesRouter.post('/delete', languagesController.deleteLanguage.bind(languagesController));
languagesRouter.post('/edit', languagesController.editLanguage.bind(languagesController));
languagesRouter.post('/setActive', languagesController.setActiveLanguage.bind(languagesController));

export { languagesRouter };