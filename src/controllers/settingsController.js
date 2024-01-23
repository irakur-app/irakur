/* 
 * Lingua Immerse - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const Settings = require ('../models/settings');

class SettingsController
{
    constructor()
    {
        this.settings = new Settings();
    }

    renderSettings(req, res)
    {
        res.render('settingsView', {settings: this.settings});
    }
}

module.exports = SettingsController;