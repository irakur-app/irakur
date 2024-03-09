/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Request, Response } from 'express';

import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class PagesController
{
    async getAllPages(req:Request, res:Response)
    {
        const pages = await databaseManager.executeQuery(queries.getAllPages,
            [req.params.textId]
        );

        res.json({pages: pages});
    }

    async getPage(req:Request, res:Response)
    {
        const page = databaseManager.getFirstRow(queries.getPageByIndex,
            [req.params.textId, req.params.pageId]
        );

        res.json({page: page});
    }

    async editPage(req:Request, res:Response)
    {
        const queryParams: any[] = [];
        const updates: string[] = [];

        if (req.body.textId)
        {
            res.status(400).send('Forbidden to change text');
        }
        if (req.body.index)
        {
            res.status(400).send('Forbidden to change index');
        }
        if (req.body.content)
        {
            updates.push('content = ?');
            queryParams.push(req.body.content);
        }
        
        if (updates.length > 0)
        {
            queryParams.push(req.params.textId);
            queryParams.push(req.params.pageId);
            console.log(queryParams);

            const dynamicQuery = queries.editText.replace(/\%DYNAMIC\%/, () => {
                return updates.join(', ');
            });

            console.log(dynamicQuery);

            await databaseManager.executeQuery(dynamicQuery, queryParams);
        }
    }
}

export { PagesController };