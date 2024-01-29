/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */
import express from 'express';
const homeRouter = express.Router();
import { HomeController } from '../controllers/homeController';

const homeController = new HomeController();

homeRouter.get('/', homeController.renderHome.bind(homeController));

export { homeRouter };