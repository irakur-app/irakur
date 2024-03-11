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

	//call localhost:5000/api/languages/
	async getLanguages()
	{
		const response = await fetch('api/languages/');
		const data = await response.json();
		return data.languages;
	}
}

const backendConnector = new BackendConnector();
export { backendConnector };