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
    renderTexts(req:Request, res:Response)
    {
        databaseManager.executeQuery(textQueries.getTexts,
            [req.body.languageId]
        ).then((texts) =>
        {
            res.json({texts: texts});
        });
    }

    renderAddText(req:Request, res:Response)
    {
        res.json({language: req.body.languageId});
    }

    renderEditText(req:Request, res:Response)
    {
        databaseManager.getFirstRow(textQueries.getText,
            [req.params.id]
        ).then((text) =>
        {
            res.json({text: text});
        });
    }

    addText(req:Request, res:Response)
    {
        databaseManager.executeQuery(textQueries.addText,
            [req.body.languageId, req.body.title, req.body.content, req.body.sourceUrl]
        ).then(() =>
        {
            res.redirect('/texts');
        });
    }

    deleteText(req:Request, res:Response)
    {
        databaseManager.executeQuery(textQueries.deleteText,
            [req.body.id]
        ).then(() =>
        {
            res.redirect('/texts');
        });
    }

    editText(req:Request, res:Response)
    {
        databaseManager.executeQuery(textQueries.editText,
            [req.body.title, req.body.content, req.body.sourceUrl, req.body.id]
        ).then(() =>
        {
            res.redirect('/texts');
        });
    }
}

export { TextsController };