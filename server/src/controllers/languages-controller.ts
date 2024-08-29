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
	addLanguage(name: string, dictionaryUrl: string, shouldShowSpaces: boolean): void
	{
		databaseManager.runQuery(
			queries.addLanguage,
			{
				name,
				dictionaryUrl,
				shouldShowSpaces,
			}
		);
	}

	deleteLanguage(languageId: number): void
	{
		databaseManager.runQuery(
			queries.deleteLanguage,
			{
				languageId,
			}
		);
	}

	editLanguage(
		languageId: number,
		name: string,
		dictionaryUrl: string,
		shouldShowSpaces: boolean
	): void
	{
		const queryParams: Record<string, any> = {};
		const updates: string[] = [];
	
		if (name !== undefined)
		{
			updates.push('name = :name');
			queryParams.name = name;
		}
		if (dictionaryUrl !== undefined)
		{
			updates.push('dictionary_url = :dictionaryUrl');
			queryParams.dictionaryUrl = dictionaryUrl;
		}
		if (shouldShowSpaces !== undefined)
		{
			updates.push('should_show_spaces = :shouldShowSpaces');
			queryParams.shouldShowSpaces = shouldShowSpaces;
		}

		if (updates.length > 0)
		{
			queryParams.languageId = languageId;

			const dynamicQuery: string = queries.editLanguage.replace(
				/\%DYNAMIC\%/,
				(): string => {
					return updates.join(', ');
				}
			);

			databaseManager.runQuery(dynamicQuery, queryParams);
		}
	}

	getAllLanguages(): Language[]
	{
		const languages: Language[] = databaseManager.getAllRows(queries.getAllLanguages);
		
		return languages;
	}

	getLanguage(languageId: number): Language
	{
		const language: Language = databaseManager.getFirstRow(
			queries.getLanguage,
			{
				languageId,
			}
		);
		
		return language;
	}
}

export { LanguagesController };
