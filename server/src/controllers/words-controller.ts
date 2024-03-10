/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Request, Response } from 'express';

import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class WordsController
{
	async addWord(req:Request, res:Response)
	{
		req.body.entries = JSON.stringify(req.body.entries);

		await databaseManager.executeQuery(queries.addWord,
			[req.body.languageId, req.body.content, req.body.status, req.body.entries, req.body.notes, req.body.datetimeAdded, req.body.datetimeUpdated]
		)
		
		res.redirect('/words');
	}

	async getWord(req:Request, res:Response)
	{
		const word = await databaseManager.getFirstRow(queries.getWord,
			[req.params.wordId]
		)

		word.entries = JSON.parse(word.entries);

		res.json({word: word});
	}

	async deleteWord(req:Request, res:Response)
	{
		await databaseManager.executeQuery(queries.deleteWord,
			[req.params.wordId]
		)
		
		res.redirect('/words');
	}

	async editWord(req:Request, res:Response)
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
		if (req.body.content)
		{
			updates.push('content = ?');
			queryParams.push(req.body.content);
		}
		if (req.body.status)
		{
			updates.push('status = ?');
			queryParams.push(req.body.status);
		}
		if (req.body.entries)
		{
			req.body.entries = JSON.stringify(req.body.entries);

			updates.push('entries = ?');
			queryParams.push(req.body.entries);
		}
		if (req.body.notes)
		{
			updates.push('notes = ?');
			queryParams.push(req.body.notes);
		}
		if (req.body.datetimeAdded)
		{
			updates.push('datetime_added = ?');
			queryParams.push(req.body.datetimeAdded);
		}
		if (req.body.datetimeUpdated)
		{
			updates.push('datetime_updated = ?');
			queryParams.push(req.body.datetimeUpdated);
		}

		if (updates.length > 0)
		{
			queryParams.push(req.params.wordId);
			console.log(queryParams);
	
			const dynamicQuery = queries.editWord.replace(/\%DYNAMIC\%/, () => {
				return updates.join(', ');
			});
	
			console.log(dynamicQuery);

			await databaseManager.executeQuery(dynamicQuery, queryParams);
		}
		
		res.redirect('/words');
	}
}

export { WordsController };