/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Request, Response } from 'express';

import { Settings } from '../models/settings';

class SettingsController
{
    settings:Settings;

    constructor()
    {
        this.settings = new Settings();
    }

    renderSettings(req:Request, res:Response)
    {
        res.json({});
    }
}

export { SettingsController };