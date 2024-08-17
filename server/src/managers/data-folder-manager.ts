/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import fs from 'fs';
import path from 'path';

import { getEnvironmentVariable } from '../../../common/utils';

import { databaseManager } from '../database/database-manager';

class DataFolderManager
{
	private static instance: DataFolderManager;

	private profileNames: string[] = [];
	
	constructor()
	{
		if (DataFolderManager.instance)
		{
			return DataFolderManager.instance;
		}
		
		this.readDataFolder();

		if (this.profileNames.length === 0)
		{
			this.createProfile('User 1');
			this.setActiveProfile('User 1');
		}
		else if (this.profileNames.length === 1)
		{
			this.setActiveProfile(this.profileNames[0]);
		}

		DataFolderManager.instance = this;
	}

	readDataFolder(): void
	{
		const dataFolderPath: string = getEnvironmentVariable('DATA_FOLDER_PATH');
		if (!fs.existsSync(dataFolderPath))
		{
			fs.mkdirSync(dataFolderPath, { recursive: true });
		}

		console.log('Data folder path: ' + dataFolderPath);

		// Find an array of folders in the data folder that start with 'profile-'
		this.profileNames = fs.readdirSync(dataFolderPath, { withFileTypes: true })
			.filter((dirent: fs.Dirent) => (dirent.name.startsWith('profile-') && dirent.isDirectory()))
			.map((dirent: fs.Dirent) => dirent.name)
			.map((folder: string) => folder.substring('profile-'.length));
	}

	createProfile(name: string): void
	{
		const profilePath: string = path.join(getEnvironmentVariable('DATA_FOLDER_PATH'), 'profile-' + name);
		if (fs.existsSync(profilePath))
		{
			throw new Error('Profile ' + name + ' already exists');
		}

		fs.mkdirSync(profilePath);

		this.profileNames.push(name);
	}

	getProfileNames(): string[]
	{
		return this.profileNames;
	}

	renameProfile(oldName: string, newName: string): void
	{
		const oldPath: string = path.join(getEnvironmentVariable('DATA_FOLDER_PATH'), 'profile-' + oldName);
		const newPath: string = path.join(getEnvironmentVariable('DATA_FOLDER_PATH'), 'profile-' + newName);
		fs.renameSync(oldPath, newPath);
	}

	setActiveProfile(profileName: string): void
	{
		databaseManager.openDatabase(
			path.join(getEnvironmentVariable('DATA_FOLDER_PATH'), 'profile-' + profileName, 'database.db')
		);
	}
}

const dataFolderManager: DataFolderManager = new DataFolderManager();

export { dataFolderManager };
