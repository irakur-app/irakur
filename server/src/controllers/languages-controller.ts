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
            [req.params.languageId]
        );
        
        res.redirect('/languages');
    }

    async editLanguage(req:Request, res:Response)
    {
        const queryParams: any[] = [];
        const updates: string[] = [];
    
        if (req.body.name)
        {
            updates.push('name = ?');
            queryParams.push(req.body.name);
        }
        if (req.body.dictionaryUrl)
        {
            updates.push('dictionary_url = ?');
            queryParams.push(req.body.dictionaryUrl);
        }
        if (req.body.shouldShowSpaces)
        {
            updates.push('should_show_spaces = ?');
            queryParams.push(req.body.shouldShowSpaces);
        }

        if (updates.length > 0)
        {
            queryParams.push(req.params.languageId);
            console.log(queryParams);

            const dynamicQuery = languageQueries.editLanguage.replace(/\%DYNAMIC\%/, () => {
                return updates.join(', ');
            });

            console.log(dynamicQuery);

            await databaseManager.executeQuery(dynamicQuery, queryParams);
        }
        
        res.redirect('/languages');
    }

    async getAllLanguages(req:Request, res:Response)
    {
        const languages = await databaseManager.executeQuery(languageQueries.getLanguages);
        
        res.json({languages: languages});
    }

    async getLanguage(req:Request, res:Response)
    {
        let language = await databaseManager.getFirstRow(languageQueries.getLanguage,
            [req.params.languageId]
        );

        language = language as DatabaseLanguage;
        
        res.json({language: language});
    }
}

export { LanguagesController };