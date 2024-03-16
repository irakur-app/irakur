/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { databaseManager } from '../database/database-manager';
import { queries } from '../database/queries';

class LanguagesController
{
	async addLanguage(name: string, dictionaryUrl: string, shouldShowSpaces: boolean)
	{
		await databaseManager.executeQuery(queries.addLanguage,
			[name, dictionaryUrl, shouldShowSpaces]
		);

		return true;
	}

	async deleteLanguage(languageId: number)
	{
		await databaseManager.executeQuery(queries.deleteLanguage,
			[languageId]
		);

		return true;
	}

	async editLanguage(languageId: number, name: string, dictionaryUrl: string, shouldShowSpaces: boolean)
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
			console.log(queryParams);

			const dynamicQuery = queries.editLanguage.replace(/\%DYNAMIC\%/, () => {
				return updates.join(', ');
			});

			console.log(dynamicQuery);

			await databaseManager.executeQuery(dynamicQuery, queryParams);
		}

		return true;
	}

	async getAllLanguages()
	{
		const languages = await databaseManager.executeQuery(queries.getAllLanguages);
		
		return languages;
	}

	async getLanguage(languageId: number)
	{
		let language = await databaseManager.getFirstRow(queries.getLanguage,
			[languageId]
		);
		
		return language;
	}
}

export { LanguagesController };