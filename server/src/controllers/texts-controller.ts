/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Request, Response } from 'express';

import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class TextsController
{
    async addText(req:Request, res:Response)
    {
        await databaseManager.executeQuery(queries.addText,
            [req.body.languageId, req.body.title, req.body.content, req.body.sourceUrl]
        )
        
        res.redirect('/texts');
    }

    async getAllTexts(req:Request, res:Response)
    {
        const texts = await databaseManager.executeQuery(queries.getAllTexts,
            [req.body.languageId]
        );
        
        res.json({texts: texts});
    }

    async getText(req:Request, res:Response)
    {
        const text = databaseManager.getFirstRow(queries.getText,
            [req.params.id]
        )

        res.json({text: text});
    }

    async deleteText(req:Request, res:Response)
    {
        await databaseManager.executeQuery(queries.deleteText,
            [req.params.id]
        )
        
        res.redirect('/texts');
    }

    async editText(req:Request, res:Response)
    {
        const queryParams: any[] = [];
        const updates: string[] = [];
    
        if (req.body.languageId)
        {
            const language = await databaseManager.getFirstRow(queries.getLanguage, [req.body.languageId]);
            if (!language)
            {
                res.status(400).send('Language does not exist');
                return;
            }
            updates.push('language_id = ?');
            queryParams.push(req.body.languageId);
        }
        if (req.body.title)
        {
            updates.push('title = ?');
            queryParams.push(req.body.title);
        }
        if (req.body.content)
        {
            updates.push('content = ?');
            queryParams.push(req.body.content);
        }
        if (req.body.sourceUrl)
        {
            updates.push('source_url = ?');
            queryParams.push(req.body.sourceUrl);
        }

        if (updates.length > 0)
        {
            queryParams.push(req.params.textId);
            console.log(queryParams);

            const dynamicQuery = queries.editText.replace(/\%DYNAMIC\%/, () => {
                return updates.join(', ');
            });

            console.log(dynamicQuery);

            await databaseManager.executeQuery(dynamicQuery, queryParams);
        }
        
        res.redirect('/texts');
    }
}

export { TextsController };