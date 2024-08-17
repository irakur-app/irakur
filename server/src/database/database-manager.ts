/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

import { getEnvironmentVariable } from '../../../common/utils';
import { queries } from './queries';

class DatabaseManager
{
	private static instance: DatabaseManager;
	database: sqlite3.Database;

	constructor(folderPath: string, fileName: string)
	{
		if (DatabaseManager.instance)
		{
			this.database = DatabaseManager.instance.database;
			return DatabaseManager.instance;
		}

		const dataFolderPath: string = folderPath;
		const databaseFilePath: string = path.join(dataFolderPath, fileName);

		if (!fs.existsSync(dataFolderPath))
		{
			fs.mkdirSync(dataFolderPath, { recursive: true });
		}

		if (!fs.existsSync(databaseFilePath))
		{
			console.log('Database not found. Creating empty database.');
			try
			{
				fs.writeFileSync(databaseFilePath, '');
				console.log('Created empty database.');
			}
			catch(error)
			{
				console.error(error);
			}
		}

		this.database = new sqlite3.Database(
			databaseFilePath,
			(error: Error | null): void => {
				if (error)
				{
					console.error(error.message);
				}
				else
				{
					console.log('Connected to ' + databaseFilePath);
				}
			}
		);

		this.initializeDatabase();

		DatabaseManager.instance = this;
	}

	async initializeDatabase(): Promise<void>
	{
		// Create tables
		await this.executeQuery(queries.createConfigurationTable);
		await this.executeQuery(queries.createLanguageTable);
		await this.executeQuery(queries.createTextTable);
		await this.executeQuery(queries.createPageTable);
		await this.executeQuery(queries.createWordTable);
		await this.executeQuery(queries.createEntryTable);
		await this.executeQuery(queries.createStatusLogTable);

		// Create indexes
		await this.executeQuery(queries.createTextLanguageIdTitleIndex);
		await this.executeQuery(queries.createWordLowerContentLanguageIdIndex);
		await this.executeQuery(queries.createWordLanguageIdTokenCountContentIndex);

		// Create triggers
		await this.executeQuery(queries.createInsertStatusLogAfterInsertWordTrigger);
		await this.executeQuery(queries.createInsertStatusLogAfterUpdateWordTrigger);
		await this.executeQuery(queries.createDeleteStatusLogAfterDeleteWordTrigger);
	}

	executeQuery(query: string, parameters: any[] = []): Promise<any>
	{
		return new Promise(
			(resolve: (value: any) => void, reject: (reason?: any) => void): void => {
				this.database.all(
					query,
					parameters,
					(error: Error | null, rows: unknown[]) => {
						if (error)
						{
							reject(error);
						}
						else
						{
							resolve(rows);
						}
					}
				);
			}
		);
	}

	getFirstRow(query: string, parameters: any[] = []): Promise<any>
	{
		return new Promise(
			(resolve: (value: any) => void, reject: (reason?: any) => void): void => {
				this.database.all(
					query,
					parameters,
					(error: Error | null, rows: unknown[]) => {
						if (error)
						{
							reject(error);
						}
						else
						{
							resolve(rows[0]);
						}
					}
				);
			}
		);
	}

	getLastInsertId(): Promise<any>
	{
		return this.getFirstRow(queries.getLastInsertId);
	}
}

const databaseFileName: string = 'database.db';

const databaseManager = new DatabaseManager(getEnvironmentVariable('DATA_FOLDER_PATH'), databaseFileName);

export { databaseManager };
