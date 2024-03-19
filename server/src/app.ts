/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import express from 'express';
const app: express.Application = express();
import path from 'path';
import morgan from 'morgan';

import cors from 'cors';
app.use(cors());

//settings
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middlewares
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));

//routes
import { router } from './routers/api-router';
app.use('/api', router);

app.listen(
	app.get('port'),
	(): void => {
		console.log('Server on port', app.get('port'));
	}
);
