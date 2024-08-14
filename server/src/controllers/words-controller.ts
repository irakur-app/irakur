/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Entry, RawWord, Word } from "@common/types";
import { tokenizeString } from "../../../common/utils";
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
		const tokenizedContent: string[] = tokenizeString(content);

		await databaseManager.executeQuery(
			queries.addWord,
			[languageId, content, status, notes, datetimeAdded, datetimeUpdated, tokenizedContent.length]
		);

		const wordId: number = (await databaseManager.getLastInsertId()).id;

		for (let i = 0; i < entries.length; i++)
		{
			await databaseManager.executeQuery(
				queries.addEntry,
				[wordId, i, entries[i].meaning, entries[i].reading]
			);
		}
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
			const tokenizedContent: string[] = tokenizeString(content);

			valueList.push(
				`(${languageId}, '${content}', ${status}, '', '${datetimeAdded}', '${datetimeAdded}', ${tokenizedContent.length})`
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

		const entries: Entry[] = await databaseManager.executeQuery(
			queries.getEntriesByWord,
			[wordId]
		);

		const word: Word = {
			...rawWord,
			entries: entries
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

		const entries: Entry[] = await databaseManager.executeQuery(
			queries.getEntriesByWord,
			[rawWord.id]
		);

		const word: Word = {
			...rawWord,
			entries: entries
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
			await this.updateEntries(wordId, entries);
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

	async updateEntries(wordId: number, entries: Entry[]): Promise<void>
	{
		await databaseManager.executeQuery(
			queries.deleteEntriesByWord,
			[wordId]
		);

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

		await databaseManager.executeQuery(dynamicQuery);
	}
}

export { WordsController };

