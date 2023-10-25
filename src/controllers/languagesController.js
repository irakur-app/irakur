const Languages = require ('../models/languages');

class LanguagesController
{
    constructor()
    {
        this.languages = new Languages();
    }

    renderLanguages(req, res)
    {
        res.render('languagesView', {languages: this.languages});
    }
}

module.exports = LanguagesController;