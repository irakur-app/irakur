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
}

export { ServiceConnector };