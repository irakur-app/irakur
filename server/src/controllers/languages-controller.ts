/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Request, Response } from 'express';

import { DatabaseLanguage } from '../types/database';

import { databaseManager } from '../database/database-manager';
import { languageQueries } from '../database/queries/language-queries';

class LanguagesController
{
    renderLanguages(req:Request, res:Response)
    {
        databaseManager.executeQuery(languageQueries.getLanguages).then((languages) =>
        {
            res.json({languages: languages});
        });
    }
    renderEditLanguage(req:Request, res:Response)
    {
        databaseManager.getFirstRow(languageQueries.getLanguage,
            [req.params.id]
        ).then((language) =>
        {
            language = language as DatabaseLanguage;
            
            res.json({language: language});
        });
    }

    addLanguage(req:Request, res:Response)
    {
        databaseManager.executeQuery(languageQueries.addLanguage,
            [req.body.name, req.body.dictionaryUrl, (req.body.shouldShowSpaces === 'on' ? true : false).toString()]
        ).then(() =>
        {
            res.redirect('/languages');
        });
    }

    deleteLanguage(req:Request, res:Response)
    {
        databaseManager.executeQuery(languageQueries.deleteLanguage,
            [req.body.id]
        ).then(() =>
        {
            res.redirect('/languages');
        });
    }

    editLanguage(req:Request, res:Response)
    {
        databaseManager.executeQuery(languageQueries.editLanguage,
            [req.body.name, req.body.dictionaryUrl, (req.body.shouldShowSpaces === 'on' ? true : false).toString(), req.body.id]
        ).then(() =>
        {
            res.redirect('/languages');
        });
    }
}

export { LanguagesController };