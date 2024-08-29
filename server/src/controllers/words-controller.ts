/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Entry, RawWord, Word } from "@common/types";
import { tokenizeString } from "../../../common/utils";
import { databaseManager } from "../database/database-manager";
import { queries } from "../database/queries";

class WordsController
{
	addWord(
		languageId: number,
		content: string,
		status: number,
		entries: Entry[],
		notes: string,
		timeAdded: number,
		timeUpdated: number
	): void
	{
		const tokenizedContent: string[] = tokenizeString(content);

		databaseManager.runQuery(
			queries.addWord,
			[languageId, content, status, notes, timeAdded, timeUpdated, tokenizedContent.length]
		);

		const wordId: number = databaseManager.getLastInsertId().id;

		for (let i = 0; i < entries.length; i++)
		{
			databaseManager.runQuery(
				queries.addEntry,
				[wordId, i, entries[i].meaning, entries[i].reading]
			);
		}
	}

	addWordsInBatch(
		languageId: number,
		contents: string[],
		status: number,
		timeAdded: number
	): void
	{
		const valueList: string[] = [];
		for (const content of contents)
		{
			const tokenizedContent: string[] = tokenizeString(content);

			valueList.push(
				`(${languageId}, '${content}', ${status}, '', '${timeAdded}', '${timeAdded}', ${tokenizedContent.length})`
			);
		}

		const dynamicQuery: string = queries.addWordsInBatch.replace(
			/\%DYNAMIC\%/,
			(): string => {
				return valueList.join(', ');
			}
		);

		databaseManager.runQuery(dynamicQuery);
	}

	getWord(wordId: number): Word
	{
		const rawWord: RawWord = databaseManager.getFirstRow(
			queries.getWord,
			[wordId]
		);

		const entries: Entry[] = databaseManager.getAllRows(
			queries.getEntriesByWord,
			[wordId]
		);

		const word: Word = {
			...rawWord,
			entries: entries
		};

		return word;
	}

	findWord(content: string, languageId: number): Word | null
	{
		const rawWord: RawWord | null = databaseManager.getFirstRow(
			queries.findWord,
			[content, languageId]
		);

		if (!rawWord)
		{
			return null;
		}

		const entries: Entry[] = databaseManager.getAllRows(
			queries.getEntriesByWord,
			[rawWord.id]
		);

		const word: Word = {
			...rawWord,
			entries: entries
		};

		return word;
	}

	deleteWord(wordId: number): void
	{
		databaseManager.getAllRows(
			queries.deleteWord,
			[wordId]
		);
	}

	editWord(
		languageId: number,
		content: string,
		status: number,
		entries: Entry[],
		notes: string,
		timeAdded: number,
		timeUpdated: number,
		wordId: number
	): void
	{
		const queryParams: any[] = [];
		const updates: string[] = [];
	
		if (languageId !== undefined)
		{
			const language = databaseManager.getFirstRow(
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

			const tokenizedContent: string[] = tokenizeString(content);

			updates.push('token_count = ?');
			queryParams.push(tokenizedContent.length);
		}
		if (status !== undefined)
		{
			updates.push('status = ?');
			queryParams.push(status);
		}
		if (entries !== undefined)
		{
			this.updateEntries(wordId, entries);
		}
		if (notes !== undefined)
		{
			updates.push('notes = ?');
			queryParams.push(notes);
		}
		if (timeAdded !== undefined)
		{
			updates.push('time_added = ?');
			queryParams.push(timeAdded);
		}
		if (timeUpdated !== undefined)
		{
			updates.push('time_updated = ?');
			queryParams.push(timeUpdated);
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

			databaseManager.runQuery(dynamicQuery, queryParams);
		}
	}

	updateEntries(wordId: number, entries: Entry[]): void
	{
		databaseManager.runQuery(
			queries.deleteEntriesByWord,
			[wordId]
		);

		if (!entries || entries.length === 0)
		{
			return;
		}

		const dynamicQuery: string = queries.addEntriesInBatch.replace(
			/\%DYNAMIC\%/,
			(): string => {
				return entries.map(
					(token: Entry, index: number): string => {
						return `(${wordId},
								${index + 1},
								'${token.meaning.replace(/'/g, "''")}',
								'${token.reading.replace(/'/g, "''")}'
							)`;
					}
				).join(', ');
			}
		);

		databaseManager.runQuery(dynamicQuery);
	}
}

export { WordsController };

