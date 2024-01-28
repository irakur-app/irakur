/* 
 * Lingua Immerse - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const Home = require ('../models/home');
const Languages = require ('../models/languages');

class HomeController
{
    constructor()
    {
        this.home = new Home();
        this.languages = new Languages();
    }

    renderHome(req, res)
    {
        this.languages.getLanguages().then((languages) =>
        {
            this.languages.getActiveLanguage().then((activeLanguage) =>
            {
                console.log(activeLanguage);
                res.json({title: this.home.title, links: this.home.links, languages: languages, activeLanguage: activeLanguage});
            });
        });
    }
}

module.exports = HomeController;