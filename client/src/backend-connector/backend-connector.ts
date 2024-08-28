/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Entry, Language, Page, ReducedWordData, Text, Word } from '@common/types';

class BackendConnector
{
	private static instance: BackendConnector;

	constructor()
	{
		if (BackendConnector.instance)
		{
			return BackendConnector.instance;
		}
	}

	async addLanguage(
		name: string,
		dictionaryUrl: string,
		shouldShowSpaces: boolean,
		alphabet: string,
		sentenceDelimiters: string
	): Promise<boolean>
	{
		const response: Response = await fetch(
			'/api/languages',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					{
						name,
						dictionaryUrl,
						shouldShowSpaces,
						alphabet,
						sentenceDelimiters,
					}
				),
			}
		);
		
		if (!response.ok)
		{
			console.error('Failed to add language');
		}
		else
		{
			console.log('Language added');
		}

		return response.ok;
	}

	async deleteLanguage(languageId: number): Promise<boolean>
	{
		const response: Response = await fetch(
			'/api/languages/' + languageId,
			{
				method: 'DELETE',
			}
		);

		if (!response.ok)
		{
			console.error('Failed to delete language');
		}
		else
		{
			console.log('Language deleted');
		}

		return response.ok;
	}

	async editLanguage(
		languageId: number,
		name: string,
		dictionaryUrl: string,
		shouldShowSpaces: boolean,
		alphabet: string,
		sentenceDelimiters: string
	): Promise<boolean>
	{
		const response: Response = await fetch(
			'/api/languages/' + languageId,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					{
						name,
						dictionaryUrl,
						shouldShowSpaces,
						alphabet,
						sentenceDelimiters,
					}
				),
			}
		);

		if (!response.ok)
		{
			console.error('Failed to edit language');
		}
		else
		{
			console.log('Language edited');
		}

		return response.ok;
	}

	async getLanguage(languageId: number): Promise<Language>
	{
		const response: Response = await fetch('/api/languages/' + languageId);
		const language: Language = await response.json();
		return language;
	}

	async getLanguages(): Promise<Language[]>
	{
		const response: Response = await fetch('/api/languages/');
		const languages: Language[] = (await response.json()).languages;
		return languages;
	}

	async addText(
		title: string,
		languageId: number,
		content: string,
		numberOfPages: number,
		sourceUrl: string
	): Promise<boolean>
	{
		const response: Response = await fetch(
			'/api/texts',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					{
						title,
						languageId,
						content,
						numberOfPages,
						sourceUrl,
					}
				),
			}
		);
		
		if (!response.ok)
		{
			console.error('Failed to add text');
		}
		else
		{
			console.log('Text added');
		}

		return response.ok;
	}

	async deleteText(textId: number): Promise<boolean>
	{
		const response: Response = await fetch(
			'/api/texts/' + textId,
			{
				method: 'DELETE',
			}
		);

		if (!response.ok)
		{
			console.error('Failed to delete text');
		}
		else
		{
			console.log('Text deleted');
		}

		return response.ok;
	}

	async editText(
		id: number,
		title: string | undefined,
		languageId: number | undefined,
		content: string | undefined,
		numberOfPages: number | undefined,
		sourceUrl: string | undefined,
		timeOpened: number | undefined,
		timeFinished: number | undefined,
		progress: number | undefined
	): Promise<boolean>
	{
		const response: Response = await fetch(
			'/api/texts/' + id,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					{
						title,
						languageId,
						content,
						numberOfPages,
						sourceUrl,
						timeOpened,
						timeFinished,
						progress,
					}
				),
			}
		);

		if (!response.ok)
		{
			console.error('Failed to edit text');
		}
		else
		{
			console.log('Text edited');
		}

		return response.ok;
	}

	async getText(textId: number): Promise<Text>
	{
		const response: Response = await fetch('/api/texts/' + textId);
		const text: Text = await response.json();
		return text;
	}

	async getTexts(languageId: number | undefined): Promise<Text[]>
	{
		let response: Response;
		if (languageId !== undefined)
		{
			response = await fetch('/api/texts?languageId=' + languageId);
		}
		else
		{
			response = await fetch('/api/texts');
		}
		const texts: Text[] = (await response.json()).texts;
		return texts;
	}

	async getPages(textId: number): Promise<Page[]>
	{
		const response: Response = await fetch('/api/texts/' + textId + '/pages');
		const pages = (await response.json()).pages;
		return pages;
	}

	async addWord(
		languageId: number,
		content: string,
		status: number,
		entries: Entry[],
		notes: string,
		timeAdded: number,
		timeUpdated: number
	): Promise<boolean>
	{
		const response: Response = await fetch(
			'/api/words',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					{
						languageId,
						content,
						status,
						entries,
						notes,
						timeAdded,
						timeUpdated,
					}
				),
			}
		);

		if (!response.ok)
		{
			console.error('Failed to add word');
		}
		else
		{
			console.log('Word added');
		}

		return response.ok;
	}

	async addWordsInBatch(
		languageId: number,
		contents: string[],
		status: number,
		timeAdded: number
	): Promise<boolean>
	{
		const response: Response = await fetch(
			'/api/words/batch',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					{
						languageId,
						contents,
						status,
						timeAdded,
					}
				),
			}
		);

		if (!response.ok)
		{
			console.error('Failed to add words');
		}
		else
		{
			console.log('Words added');
		}

		return response.ok;
	}

	async editWord(
		id: number,
		status: number,
		entries: Entry[],
		notes: string,
		timeUpdated: number
	): Promise<boolean>
	{
		const response: Response = await fetch(
			'/api/words/' + id,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					{
						status,
						entries,
						notes,
						timeUpdated,
					}
				),
			}
		);

		if (!response.ok)
		{
			console.error('Failed to edit word');
		}
		else
		{
			console.log('Word edited');
		}

		return response.ok;
	}

	async getWords(textId: number, pagePosition: number): Promise<ReducedWordData[]>
	{
		const response: Response = await fetch('/api/texts/' + textId + '/pages/' + pagePosition + '/words');
		const words = (await response.json()).words;
		return words;
	}

	async findWord(content: string, languageId: number): Promise<Word | null>
	{
		const response: Response = await fetch('/api/words' + '?content=' + content + '&languageId=' + languageId);
		if (!response.ok)
		{
			return null;
		}
		const word = await response.json();
		return word;
	}

	async getWordsImprovedCount(languageId: number): Promise<number>
	{
		const response: Response = await fetch('/api/statistics/words-improved-count/' + languageId);
		const wordsImprovedCount = (await response.json()).wordsImprovedCount;
		return wordsImprovedCount;
	}

	async getProfiles(): Promise<string[]>
	{
		const response: Response = await fetch('/api/profiles');
		const profiles = (await response.json()).profiles;
		return profiles;
	}

	async getActiveProfile(): Promise<string | null>
	{
		const response: Response = await fetch('/api/profiles/active');
		if (!response.ok)
		{
			return null;
		}
		const profileName = (await response.json()).profileName;
		return profileName;
	}

	async setActiveProfile(profileName: string): Promise<boolean>
	{
		const response: Response = await fetch(
			'/api/profiles/active',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					{
						profileName,
					}
				),
			}
		);

		if (!response.ok)
		{
			console.error('Failed to set active profile');
		}
		else
		{
			console.log('Active profile set');
		}

		return response.ok;
	}

	async addProfile(profileName: string): Promise<boolean>
	{
		const response: Response = await fetch(
			'/api/profiles',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					{
						profileName
					}
				),
			}
		);
		
		if (!response.ok)
		{
			console.error('Failed to add profile');
		}
		else
		{
			console.log('Profile added');
		}

		return response.ok;
	}
}

const backendConnector: BackendConnector = new BackendConnector();
export { backendConnector };
