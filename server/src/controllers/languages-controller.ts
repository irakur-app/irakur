/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Language } from '@common/types';
import { databaseManager } from '../database/database-manager';
import { queries } from '../database/queries';

class LanguagesController
{
	async addLanguage(name: string, dictionaryUrl: string, shouldShowSpaces: boolean): Promise<void>
	{
		await databaseManager.runQuery(
			queries.addLanguage,
			[name, dictionaryUrl, shouldShowSpaces]
		);
	}

	async deleteLanguage(languageId: number): Promise<void>
	{
		await databaseManager.runQuery(
			queries.deleteLanguage,
			[languageId]
		);
	}

	async editLanguage(
		languageId: number,
		name: string,
		dictionaryUrl: string,
		shouldShowSpaces: boolean
	): Promise<void>
	{
		const queryParams: any[] = [];
		const updates: string[] = [];
	
		if (name !== undefined)
		{
			updates.push('name = ?');
			queryParams.push(name);
		}
		if (dictionaryUrl !== undefined)
		{
			updates.push('dictionary_url = ?');
			queryParams.push(dictionaryUrl);
		}
		if (shouldShowSpaces !== undefined)
		{
			updates.push('should_show_spaces = ?');
			queryParams.push(shouldShowSpaces);
		}

		if (updates.length > 0)
		{
			queryParams.push(languageId);

			const dynamicQuery: string = queries.editLanguage.replace(
				/\%DYNAMIC\%/,
				(): string => {
					return updates.join(', ');
				}
			);

			await databaseManager.runQuery(dynamicQuery, queryParams);
		}
	}

	async getAllLanguages(): Promise<Language[]>
	{
		const languages: Language[] = await databaseManager.getAllRows(queries.getAllLanguages);
		
		return languages;
	}

	async getLanguage(languageId: number): Promise<Language>
	{
		const language: Language = await databaseManager.getFirstRow(
			queries.getLanguage,
			[languageId]
		);
		
		return language;
	}
}

export { LanguagesController };
