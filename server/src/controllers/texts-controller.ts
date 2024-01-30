/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Request, Response } from 'express';

import { Texts } from '../models/texts';
import { Languages } from '../models/languages';

class TextsController
{
    texts:Texts;
    languages:Languages;

    constructor()
    {
        this.texts = new Texts();
        this.languages = new Languages();
    }

    renderTexts(req:Request, res:Response)
    {
        this.languages.getActiveLanguage().then((activeLanguage) =>
        {
            this.texts.getTexts(activeLanguage.id).then((texts) =>
            {
                res.json({title: this.texts.title, texts: texts});
            });
        });
    }

    renderAddText(req:Request, res:Response)
    {
        this.languages.getActiveLanguage().then((activeLanguage) =>
        {
            res.json({title: this.texts.title, language: activeLanguage});
        });
    }

    renderEditText(req:Request, res:Response)
    {
        this.languages.getActiveLanguage().then((activeLanguage) =>
        {
            this.texts.getText(req.params.id).then((text) =>
            {
                res.json({title: text.title, text: text});
            });
        });
    }

    addText(req:Request, res:Response)
    {
        this.languages.getActiveLanguage().then((activeLanguage) =>
        {
            this.texts.addText(activeLanguage.id, req.body.title, req.body.content, req.body.sourceUrl).then(() =>
            {
                res.redirect('/texts');
            });
        });
    }

    deleteText(req:Request, res:Response)
    {
        this.texts.deleteText(req.body.id).then(() =>
        {
            res.redirect('/texts');
        });
    }

    editText(req:Request, res:Response)
    {
        this.texts.editText(req.body.id, req.body.title, req.body.content, req.body.sourceUrl).then(() =>
        {
            res.redirect('/texts');
        });
    }
}

export { TextsController };