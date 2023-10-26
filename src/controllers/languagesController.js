const Languages = require ('../models/languages');

class LanguagesController
{
    constructor()
    {
        this.languages = new Languages();
    }

    renderLanguages(req, res)
    {
        this.languages.getLanguages().then((languages) =>
        {
            res.render('languagesView', {title: this.languages.title, languages: languages});
        });
    }
}

module.exports = LanguagesController;