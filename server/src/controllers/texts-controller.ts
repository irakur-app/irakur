/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Request, Response } from 'express';

import { databaseManager } from "../database/database-manager";
import { textQueries } from "../database/queries/text-queries";

class TextsController
{
    async renderTexts(req:Request, res:Response)
    {
        const texts = await databaseManager.executeQuery(textQueries.getTexts,
            [req.body.languageId]
        );
        
        res.json({texts: texts});
    }

    async renderAddText(req:Request, res:Response)
    {
        res.json({language: req.body.languageId});
    }

    async renderEditText(req:Request, res:Response)
    {
        const text = databaseManager.getFirstRow(textQueries.getText,
            [req.params.id]
        )

        res.json({text: text});
    }

    async addText(req:Request, res:Response)
    {
        await databaseManager.executeQuery(textQueries.addText,
            [req.body.languageId, req.body.title, req.body.content, req.body.sourceUrl]
        )
        
        res.redirect('/texts');
    }

    async deleteText(req:Request, res:Response)
    {
        await databaseManager.executeQuery(textQueries.deleteText,
            [req.body.id]
        )
        
        res.redirect('/texts');
    }

    async editText(req:Request, res:Response)
    {
        await databaseManager.executeQuery(textQueries.editText,
            [req.body.title, req.body.content, req.body.sourceUrl, req.body.id]
        )
        
        res.redirect('/texts');
    }
}

export { TextsController };