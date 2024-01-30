/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Request, Response } from 'express';

import { Languages } from '../models/languages';

import { DatabaseLanguage } from '../types/database';

class LanguagesController
{
    languages:Languages;

    constructor()
    {
        this.languages = new Languages();
    }

    renderLanguages(req:Request, res:Response)
    {
        this.languages.getLanguages().then((languages) =>
        {
            res.json({title: this.languages.title, languages: languages});
        });
    }

    renderAddLanguage(req:Request, res:Response)
    {
        res.json({title: this.languages.title});
    }

    renderEditLanguage(req:Request, res:Response)
    {
        this.languages.getLanguage(req.params.id).then((language) =>
        {
            language = language as DatabaseLanguage;
            
            res.json({title: language?.name, language: language});
        });
    }

    addLanguage(req:Request, res:Response)
    {
        this.languages.addLanguage(req.body.name, req.body.dictionaryUrl, req.body.shouldShowSpaces === 'on' ? true : false).then(() =>
        {
            res.redirect('/languages');
        });
    }

    deleteLanguage(req:Request, res:Response)
    {
        this.languages.deleteLanguage(req.body.id).then(() =>
        {
            res.redirect('/languages');
        });
    }

    editLanguage(req:Request, res:Response)
    {
        this.languages.editLanguage(req.body.id, req.body.name, req.body.dictionaryUrl, req.body.shouldShowSpaces === 'on' ? true : false).then(() =>
        {
            res.redirect('/languages');
        });
    }

    setActiveLanguage(req:Request, res:Response)
    {
        console.log(req.body);
        this.languages.setActiveLanguage(req.body.activeLanguage).then(() =>
        {
            res.redirect('back');
        });
    }
}

export { LanguagesController };