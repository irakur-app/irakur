/* 
 * Lingua Immerse - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const Index = require ('../models/index');
const Languages = require ('../models/languages');

class IndexController
{
    constructor()
    {
        this.index = new Index();
        this.languages = new Languages();
    }

    renderIndex(req, res)
    {
        this.languages.getLanguages().then((languages) =>
        {
            this.languages.getActiveLanguage().then((activeLanguage) =>
            {
                console.log(activeLanguage);
                res.json({title: this.index.title, links: this.index.links, languages: languages, activeLanguage: activeLanguage});
            });
        });
    }
}

module.exports = IndexController;