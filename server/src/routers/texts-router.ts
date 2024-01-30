/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import express from 'express';
const textsRouter = express.Router();
import { TextsController } from '../controllers/texts-controller';

const textsController = new TextsController();

textsRouter.get('/', textsController.renderTexts.bind(textsController));
textsRouter.get('/add', textsController.renderAddText.bind(textsController));
textsRouter.get('/edit/:id', textsController.renderEditText.bind(textsController));
textsRouter.post('/add', textsController.addText.bind(textsController));
textsRouter.post('/delete', textsController.deleteText.bind(textsController));
textsRouter.post('/edit', textsController.editText.bind(textsController));

export { textsRouter };