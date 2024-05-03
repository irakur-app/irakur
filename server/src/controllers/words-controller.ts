/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Entry, RawWord, Word } from "@common/types";
import { itemizeString } from "../../../common/utils";
import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class WordsController
{
	async addWord(
		languageId: number,
		content: string,
		status: number,
		entries: Entry[],
		notes: string,
		datetimeAdded: string,
		datetimeUpdated: string
	): Promise<void>
	{
		const itemizedContent: string[] = itemizeString(content);

		await databaseManager.executeQuery(
			queries.addWord,
			[languageId, content, status, JSON.stringify(entries), notes, datetimeAdded, datetimeUpdated, itemizedContent.length]
		);
	}

	async addWordsInBatch(
		languageId: number,
		contents: string[],
		status: number,
		datetimeAdded: string
	): Promise<void>
	{
		const valueList: string[] = [];
		for (const content of contents)
		{
			const itemizedContent: string[] = itemizeString(content);

			valueList.push(
				`(${languageId}, '${content}', ${status}, '[]', '', '${datetimeAdded}', '${datetimeAdded}', ${itemizedContent.length})`
			);
		}

		const dynamicQuery: string = queries.addWordsInBatch.replace(
			/\%DYNAMIC\%/,
			(): string => {
				return valueList.join(', ');
			}
		);

		await databaseManager.executeQuery(dynamicQuery);
	}

	async getWord(wordId: number): Promise<Word>
	{
		const rawWord: RawWord = await databaseManager.getFirstRow(
			queries.getWord,
			[wordId]
		);

		const word: Word = {
			...rawWord,
			entries: JSON.parse(rawWord.entries)
		};

		return word;
	}

	async findWord(content: string, languageId: number): Promise<Word | null>
	{
		const rawWord: RawWord | null = await databaseManager.getFirstRow(
			queries.findWord,
			[content, languageId]
		);

		if (!rawWord)
		{
			return null;
		}

		const word: Word = {
			...rawWord,
			entries: JSON.parse(rawWord.entries)
		};

		return word;
	}

	async deleteWord(wordId: number): Promise<void>
	{
		await databaseManager.executeQuery(
			queries.deleteWord,
			[wordId]
		);
	}

	async editWord(
		languageId: number,
		content: string,
		status: number,
		entries: Entry[],
		notes: string,
		datetimeAdded: string,
		datetimeUpdated: string,
		wordId: number
	): Promise<void>
	{
		const queryParams: any[] = [];
		const updates: string[] = [];
	
		if (languageId !== undefined)
		{
			const language = await databaseManager.getFirstRow(
				queries.getLanguage,
				[languageId]
			);
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

			const itemizedContent: string[] = itemizeString(content);

			updates.push('item_count = ?');
			queryParams.push(itemizedContent.length);
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
	
			const dynamicQuery: string = queries.editWord.replace(
				/\%DYNAMIC\%/,
				(): string => {
					return updates.join(', ');
				}
			);

			await databaseManager.executeQuery(dynamicQuery, queryParams);
		}
	}
}

export { WordsController };

