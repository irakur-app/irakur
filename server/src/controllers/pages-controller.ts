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
        const page = databaseManager.getFirstRow(queries.getPage,
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

    async getWords(req:Request, res:Response)
    {
        const page = await databaseManager.getFirstRow(queries.getPage,
            [req.params.textId, req.params.pageId]
        );

        const languageId = (await databaseManager.getFirstRow(queries.getText,
            [page.text_id]
        )).language_id;

        const items = page.content.split(/([ \r\n"':;,.¿?¡!()\-=。、！？：；「」『』（）…＝・’“”—\d])/u)
            .filter((sentence:string) => sentence !== '');
        const wordData = [];
        for (const word of items)
        {
            if (!this.isWord(word))
            {
                wordData.push({content: word, type: 'punctuation'});
            }
            const wordRow = await databaseManager.getFirstRow(queries.findWord,
                [word, languageId]
            );
            if (!wordRow)
            {
                wordData.push({content: word, status: 0, type: 'word'});
            }
            else
            {
                wordData.push({content: word, status: wordRow.status, type: 'word'});
            }
        }

        res.json({words: wordData});
    }
    isWord(item:string)
    {
        return (item.match(/[ :;,.¿?¡!()\[\]{}\s'"\-=。、！？：；「」『』（）…＝・’“”—\d]/u) === null);
    }
}

export { PagesController };