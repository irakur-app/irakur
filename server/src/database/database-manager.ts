/*
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander Aginaga San Sebastián (a.k.a. Laquin or Laquinh)
 * Licensed under version 3 of the GNU Affero General Public License
 */

import fs from 'fs';
import Database from 'better-sqlite3';

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

		this.database = new Database(databaseFilePath);

		this.database.function(
			'regexp',
			{ deterministic: true },
			(regex: any, text: any) => {
				return new RegExp(regex).test(text) ? 1 : 0;
			}
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

	initializeDatabase(): void
	{
		// Create tables
		this.runQuery(queries.createConfigurationTable);
		this.runQuery(queries.createLanguageTable);
		this.runQuery(queries.createTextTable);
		this.runQuery(queries.createPageTable);
		this.runQuery(queries.createWordTable);
		this.runQuery(queries.createEntryTable);
		this.runQuery(queries.createCollectionTable);
		this.runQuery(queries.createCollectionTextTable);
		this.runQuery(queries.createWordStatusLogTable);
		this.runQuery(queries.createTextProgressLogTable);

		// Create indexes
		this.runQuery(queries.createTextLanguageIdTitleIndex);
		this.runQuery(queries.createWordLowerContentLanguageIdIndex);
		this.runQuery(queries.createWordLanguageIdTokenCountContentIndex);

		// Create triggers
		this.runQuery(queries.createInsertWordStatusLogAfterInsertWordTrigger);
		this.runQuery(queries.createInsertWordStatusLogAfterUpdateWordTrigger);
		this.runQuery(queries.createDeleteWordStatusLogAfterDeleteWordTrigger);
		this.runQuery(queries.createInsertTextProgressLogAfterInsertTextTrigger);
		this.runQuery(queries.createInsertTextProgressLogAfterUpdateTextTrigger);
		this.runQuery(queries.createDeleteTextProgressLogAfterDeleteTextTrigger);
	}

	runQuery(query: string, parameters: Record<string, any> = {}): void
	{
		if (this.database === null)
		{
			throw new Error('Database not initialized.');
		}

		parameters = this.fixParameters(parameters);

		this.database.prepare(query).run(parameters);
	}

	getAllRows(query: string, parameters: Record<string, any> = {}): any[]
	{
		if (this.database === null)
		{
			throw new Error('Database not initialized.');
		}

		parameters = this.fixParameters(parameters);

		return this.database.prepare(query).all(parameters);
	}

	getFirstRow(query: string, parameters: Record<string, any> = {}): any
	{
		if (this.database === null)
		{
			throw new Error('Database not initialized.');
		}

		parameters = this.fixParameters(parameters);
		
		return this.database.prepare(query).get(parameters);
	}

	getLastInsertId(): number
	{
		return this.getFirstRow(queries.getLastInsertId).id;
	}

	private fixParameters(parameters: Record<string, any>): Object
	{
		for (const key in parameters)
		{
			if (typeof parameters[key] === 'boolean')
			{
				parameters[key] = parameters[key] ? 1 : 0;
			}
		}
		return parameters;
	}
}

const databaseManager = new DatabaseManager();

export { databaseManager };
