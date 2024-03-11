/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

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

	async getLanguages()
	{
		const response = await fetch('api/languages/');
		const data = await response.json();
		return data.languages;
	}

	async getTexts(languageId: number)
	{
		const response = await fetch('api/texts?languageId=' + languageId);
		const data = await response.json();
		return data.texts;
	}
}

const backendConnector = new BackendConnector();
export { backendConnector };