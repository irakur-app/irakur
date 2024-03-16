/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

import { queries } from './queries';
import { get } from 'http';

class DatabaseManager
{
	private static instance: DatabaseManager;
	database: sqlite3.Database;

	constructor(folderPath: string, fileName: string)
	{
		if(DatabaseManager.instance)
		{
			this.database = DatabaseManager.instance.database;
			return DatabaseManager.instance;
		}

		const dataFolderPath: string = folderPath;
		const databaseFilePath: string = path.join(dataFolderPath, fileName);

		if (!fs.existsSync(dataFolderPath)){
			fs.mkdirSync(dataFolderPath);
		}

		if(!fs.existsSync(databaseFilePath))
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

		this.database = new sqlite3.Database(databaseFilePath, (error): void =>
		{
			if (error)
			{
				console.error(error.message);
			}
			else
			{
				console.log('Connected to the Irakur database.');
			}
		});

		this.createTables();

		DatabaseManager.instance = this;
	}

	createTables(): void
	{
		this.database.run(queries.createConfigurationTable);
		this.database.run(queries.createLanguageTable);
		this.database.run(queries.createTextTable);
		this.database.run(queries.createPageTable);
		this.database.run(queries.createWordTable);
	}

	executeQuery(query: string, parameters: any[] = []): Promise<any>
	{
		return new Promise((resolve, reject): void =>
		{
			this.database.all(query, parameters, (error, rows) =>
			{
				if (error)
				{
					reject(error);
				}
				else
				{
					resolve(rows);
				}
			});
		});
	}

	getFirstRow(query: string, parameters: any[] = []): Promise<any>
	{
		return new Promise((resolve, reject): void =>
		{
			this.database.all(query, parameters, (error, rows) =>
			{
				if (error)
				{
					reject(error);
				}
				else
				{
					resolve(rows[0]);
				}
			});
		});
	}

	//use last_insert_rowid() to get the id of the last inserted row
	getLastInsertId(): Promise<any>
	{
		return this.getFirstRow('SELECT last_insert_rowid() AS id');
	}
}

const databaseManager = new DatabaseManager('data', 'irakur.db')
export { databaseManager };