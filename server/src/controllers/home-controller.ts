/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Request, Response } from 'express';

import { Home } from '../models/home';
import { Languages } from '../models/languages';

class HomeController
{
    home:Home;
    languages:Languages;

    constructor()
    {
        this.home = new Home();
        this.languages = new Languages();
    }

    renderHome(req:Request, res:Response)
    {
        this.languages.getLanguages().then((languages) =>
        {
            res.json({languages: languages});
        });
    }
}

export { HomeController };