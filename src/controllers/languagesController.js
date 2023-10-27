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

    renderAddLanguage(req, res)
    {
        res.render('addLanguageView', {title: this.languages.title});
    }

    addLanguage(req, res)
    {
        this.languages.addLanguage(req.body.name, req.body.dictionaryUrl, req.body.shouldShowSpaces === 'on' ? true : false).then(() =>
        {
            res.redirect('/languages');
        });
    }

    deleteLanguage(req, res)
    {
        this.languages.deleteLanguage(req.body.id).then(() =>
        {
            res.redirect('/languages');
        });
    }
}

module.exports = LanguagesController;