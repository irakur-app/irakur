/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

import { getEnvironmentVariable } from '../../../common/utils';
import { queries } from './queries';

class DatabaseManager
{
	private static instance: DatabaseManager;
	database: Database.Database | null = null;

	constructor()
	{
		if (DatabaseManager.instance)
		{
			this.database = DatabaseManager.instance.database;
			return DatabaseManager.instance;
		}

		DatabaseManager.instance = this;
	}

	openDatabase(databaseFilePath: string): void
	{
		if (!fs.existsSync(databaseFilePath))
		{
			console.log('Database not found. Creating empty database.');
			try
			{
				fs.writeFileSync(databaseFilePath, '');
				console.log('Database created.');
			}
			catch(error)
			{
				console.error(error);
			}
		}

		const options: Database.Options = {
			readonly: false,
		};

		this.database = new Database(
			databaseFilePath,
			options
		);

		console.log('Connected to ' + databaseFilePath);

		this.initializeDatabase();
	}

	closeDatabase(): void
	{
		if (this.database === null)
		{
			return;
		}
		this.database.close();
		this.database = null;
	}

	async initializeDatabase(): Promise<void>
	{
		// Create tables
		await this.runQuery(queries.createConfigurationTable);
		await this.runQuery(queries.createLanguageTable);
		await this.runQuery(queries.createTextTable);
		await this.runQuery(queries.createPageTable);
		await this.runQuery(queries.createWordTable);
		await this.runQuery(queries.createEntryTable);
		await this.runQuery(queries.createStatusLogTable);

		// Create indexes
		await this.runQuery(queries.createTextLanguageIdTitleIndex);
		await this.runQuery(queries.createWordLowerContentLanguageIdIndex);
		await this.runQuery(queries.createWordLanguageIdTokenCountContentIndex);

		// Create triggers
		await this.runQuery(queries.createInsertStatusLogAfterInsertWordTrigger);
		await this.runQuery(queries.createInsertStatusLogAfterUpdateWordTrigger);
		await this.runQuery(queries.createDeleteStatusLogAfterDeleteWordTrigger);
	}

	runQuery(query: string, parameters: any[] = []): void
	{
		if (this.database === null)
		{
			throw new Error('Database not initialized.');
		}

		parameters = this.fixParameters(parameters);

		this.database.prepare(query).run(parameters);
	}

	getAllRows(query: string, parameters: any[] = []): any[]
	{
		if (this.database === null)
		{
			throw new Error('Database not initialized.');
		}

		parameters = this.fixParameters(parameters);

		return this.database.prepare(query).all(parameters);
	}

	getFirstRow(query: string, parameters: any[] = []): any
	{
		if (this.database === null)
		{
			throw new Error('Database not initialized.');
		}

		parameters = this.fixParameters(parameters);
		
		return this.database.prepare(query).get(parameters);
	}

	getLastInsertId(): Promise<any>
	{
		return this.getFirstRow(queries.getLastInsertId);
	}

	fixParameters(parameters: any[]): any[]
	{
		return parameters.map(
			parameter => {
				if (typeof parameter === "boolean")
				{
					return parameter ? 1 : 0;
				}
				return parameter;
			}
		);
	}
}

const databaseFileName: string = 'database.db';

const databaseManager = new DatabaseManager();

export { databaseManager };
