/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Entry, RawWord, Word } from "../../../common/types";
import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class WordsController
{
	async addWord(languageId: number, content: string, status: number, entries: Entry[], notes: string, datetimeAdded: string, datetimeUpdated: string): Promise<void>
	{
		await databaseManager.executeQuery(queries.addWord,
			[languageId, content, status, JSON.stringify(entries), notes, datetimeAdded, datetimeUpdated]
		);
	}

	async getWord(wordId: number): Promise<Word>
	{
		const rawWord: RawWord = await databaseManager.getFirstRow(queries.getWord,
			[wordId]
		)

		const word: Word = {
			...rawWord,
			entries: JSON.parse(rawWord.entries)
		};

		return word;
	}

	async deleteWord(wordId: number): Promise<void>
	{
		await databaseManager.executeQuery(queries.deleteWord,
			[wordId]
		)
	}

	async editWord(languageId: number, content: string, status: number, entries: {meaning: string, reading: string}[], notes: string, datetimeAdded: string, datetimeUpdated: string, wordId: number): Promise<void>
	{
		const queryParams: any[] = [];
		const updates: string[] = [];
	
		if (languageId !== undefined)
		{
			const language = await databaseManager.getFirstRow(queries.getLanguage, [languageId]);
			if (!language)
			{
				console.error('Language does not exist.');
				return;
			}
			updates.push('language_id = ?');
			queryParams.push(languageId);
		}
		if (content !== undefined)
		{
			updates.push('content = ?');
			queryParams.push(content);
		}
		if (status !== undefined)
		{
			updates.push('status = ?');
			queryParams.push(status);
		}
		if (entries !== undefined)
		{
			updates.push('entries = ?');
			queryParams.push(JSON.stringify(entries));
		}
		if (notes !== undefined)
		{
			updates.push('notes = ?');
			queryParams.push(notes);
		}
		if (datetimeAdded !== undefined)
		{
			updates.push('datetime_added = ?');
			queryParams.push(datetimeAdded);
		}
		if (datetimeUpdated !== undefined)
		{
			updates.push('datetime_updated = ?');
			queryParams.push(datetimeUpdated);
		}

		if (updates.length > 0)
		{
			queryParams.push(wordId);
			console.log(queryParams);
	
			const dynamicQuery: string = queries.editWord.replace(/\%DYNAMIC\%/, () => {
				return updates.join(', ');
			});
	
			console.log(dynamicQuery);

			await databaseManager.executeQuery(dynamicQuery, queryParams);
		}
	}
}

export { WordsController };