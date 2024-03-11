/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

class ServiceConnector
{
	private static instance:ServiceConnector;

	constructor()
	{
		if(ServiceConnector.instance)
		{
			return ServiceConnector.instance;
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

const serviceConnector = new ServiceConnector();
export { serviceConnector };