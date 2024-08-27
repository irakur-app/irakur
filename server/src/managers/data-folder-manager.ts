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

	private activeProfile: string | null = null;
	
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

		const profilesFolderPath: string = path.join(dataFolderPath, 'profiles');
		if (!fs.existsSync(profilesFolderPath))
		{
			fs.mkdirSync(profilesFolderPath, { recursive: true });
		}

		this.profileNames = fs.readdirSync(profilesFolderPath, { withFileTypes: true })
			.filter((dirent: fs.Dirent) => dirent.isDirectory())
			.map((dirent: fs.Dirent) => dirent.name);
	}

	createProfile(name: string): void
	{
		const profilePath: string = path.join(getEnvironmentVariable('DATA_FOLDER_PATH'), 'profiles', name);
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
		const oldPath: string = path.join(getEnvironmentVariable('DATA_FOLDER_PATH'), 'profiles', oldName);
		const newPath: string = path.join(getEnvironmentVariable('DATA_FOLDER_PATH'), 'profiles', newName);
		fs.renameSync(oldPath, newPath);

		this.profileNames = this.profileNames.map((name: string) => name === oldName ? newName : name);
	}

	getActiveProfile(): string | null
	{
		return this.activeProfile;
	}

	setActiveProfile(profileName: string | null): void
	{
		if (profileName === null)
		{
			databaseManager.closeDatabase();
			this.activeProfile = null;
			return;
		}
		this.activeProfile = profileName;
		databaseManager.openDatabase(
			path.join(getEnvironmentVariable('DATA_FOLDER_PATH'), 'profiles', profileName, 'database.db')
		);
	}

	deleteProfile(profileName: string): void
	{
		if (profileName === this.activeProfile)
		{
			databaseManager.closeDatabase();
		}

		const profilePath: string = path.join(getEnvironmentVariable('DATA_FOLDER_PATH'), 'profiles', profileName);
		fs.rmSync(profilePath, { recursive: true, force: true });

		this.profileNames = this.profileNames.filter((name: string) => name !== profileName);

		if (this.profileNames.length === 0)
		{
			this.createProfile('User 1');
			this.setActiveProfile('User 1');
		}
		else if (this.profileNames.length === 1)
		{
			this.setActiveProfile(this.profileNames[0]);
		}
		else if (profileName === this.activeProfile)
		{
			this.activeProfile = null;
		}
	}
}

const dataFolderManager: DataFolderManager = new DataFolderManager();

export { dataFolderManager };
