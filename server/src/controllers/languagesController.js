/* 
 * Lingua Immerse - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

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
            res.json({title: this.languages.title, languages: languages});
        });
    }

    renderAddLanguage(req, res)
    {
        res.json({title: this.languages.title});
    }

    renderEditLanguage(req, res)
    {
        this.languages.getLanguage(req.params.id).then((language) =>
        {
            res.json({title: language.name, language: language});
        });
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

    editLanguage(req, res)
    {
        this.languages.editLanguage(req.body.id, req.body.name, req.body.dictionaryUrl, req.body.shouldShowSpaces === 'on' ? true : false).then(() =>
        {
            res.redirect('/languages');
        });
    }

    setActiveLanguage(req, res)
    {
        console.log(req.body);
        this.languages.setActiveLanguage(req.body.activeLanguage).then(() =>
        {
            res.redirect('back');
        });
    }
}

module.exports = LanguagesController;