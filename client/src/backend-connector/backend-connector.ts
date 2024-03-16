/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { Language, Text, Page } from '../../../common/types';

class BackendConnector
{
	private static instance: BackendConnector;

	constructor()
	{
		if(BackendConnector.instance)
		{
			return BackendConnector.instance;
		}
	}

	async addLanguage(name: string, dictionaryUrl: string, shouldShowSpaces: boolean): Promise<boolean>
	{
		const response = await fetch('/api/languages', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				dictionaryUrl,
				shouldShowSpaces
			})
		});
		
		if (!response.ok) {
			console.error('Failed to add language');
		} else {
			console.log('Language added');
		}

		return response.ok;
	}

	async deleteLanguage(languageId: number): Promise<boolean>
	{
		const response = await fetch('/api/languages/' + languageId, {
			method: 'DELETE'
		});

		if (!response.ok) {
			console.error('Failed to delete language');
		} else {
			console.log('Language deleted');
		}

		return response.ok;
	}

	async editLanguage(languageId: number, name: string, dictionaryUrl: string, shouldShowSpaces: boolean): Promise<boolean>
	{
		const response = await fetch('/api/languages/' + languageId, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				dictionaryUrl,
				shouldShowSpaces
			})
		})

		if (!response.ok) {
			console.error('Failed to edit language');
		} else {
			console.log('Language edited');
		}

		return response.ok;
	}

	async getLanguage(languageId: number): Promise<Language>
	{
		const response = await fetch('/api/languages/' + languageId);
		const data = await response.json();
		return data.language;
	}

	async getLanguages(): Promise<Language[]>
	{
		const response = await fetch('/api/languages/');
		const data = await response.json();
		return data.languages;
	}

	async addText(title: string, languageId: number, content: string, numberOfPages: number, sourceUrl: string): Promise<boolean>
	{
		const response = await fetch('/api/texts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title,
				languageId,
				content,
				numberOfPages,
				sourceUrl
			})
		});
		
		if (!response.ok) {
			console.error('Failed to add text');
		} else {
			console.log('Text added');
		}

		return response.ok;
	}

	async deleteText(textId: number): Promise<boolean>
	{
		const response = await fetch('/api/texts/' + textId, {
			method: 'DELETE'
		});

		if (!response.ok) {
			console.error('Failed to delete text');
		} else {
			console.log('Text deleted');
		}

		return response.ok;
	}

	async editText(id: number, title: string, languageId: number, content: string, numberOfPages: number, sourceUrl: string): Promise<boolean>
	{
		const response = await fetch('/api/texts/' + id, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				title,
				languageId,
				content,
				numberOfPages,
				sourceUrl
			})
		});

		if (!response.ok) {
			console.error('Failed to edit text');
		} else {
			console.log('Text edited');
		}

		return response.ok;
	}

	async getText(textId: number): Promise<Text>
	{
		const response = await fetch('/api/texts/' + textId);
		const data = await response.json();
		return data.text;
	}

	async getTexts(languageId: number | undefined): Promise<Text[]>
	{
		let response;
		if(languageId !== undefined)
		{
			response = await fetch('/api/texts?languageId=' + languageId);
		}
		else
		{
			response = await fetch('/api/texts');
		}
		const data = await response.json();
		return data.texts;
	}

	async getPages(textId: number): Promise<Page[]>
	{
		const response = await fetch('/api/texts/' + textId + '/pages');
		const data = await response.json();
		return data.pages;
	}
}

const backendConnector = new BackendConnector();
export { backendConnector };