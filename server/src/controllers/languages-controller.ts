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
    async renderLanguages(req:Request, res:Response)
    {
        const languages = await databaseManager.executeQuery(languageQueries.getLanguages);
        
        res.json({languages: languages});
    }
    
    async renderEditLanguage(req:Request, res:Response)
    {
        let language = await databaseManager.getFirstRow(languageQueries.getLanguage,
            [req.params.id]
        );

        language = language as DatabaseLanguage;
        
        res.json({language: language});
    }

    async addLanguage(req:Request, res:Response)
    {
        await databaseManager.executeQuery(languageQueries.addLanguage,
            [req.body.name, req.body.dictionaryUrl, (req.body.shouldShowSpaces === 'on' ? true : false).toString()]
        );

        res.redirect('/languages');
    }

    async deleteLanguage(req:Request, res:Response)
    {
        await databaseManager.executeQuery(languageQueries.deleteLanguage,
            [req.body.id]
        );
        
        res.redirect('/languages');
    }

    async editLanguage(req:Request, res:Response)
    {
        await databaseManager.executeQuery(languageQueries.editLanguage,
            [req.body.name, req.body.dictionaryUrl, (req.body.shouldShowSpaces === 'on' ? true : false).toString(), req.body.id]
        );
        
        res.redirect('/languages');
    }
}

export { LanguagesController };