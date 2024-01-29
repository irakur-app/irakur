/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const irakurQueries = require('./queries/irakurQueries');
const languageQueries = require('./queries/languageQueries');

class DatabaseManager
{
    constructor(folderPath, fileName)
    {
        if(DatabaseManager.instance)
        {
            return DatabaseManager.instance;
        }

        const dataFolderPath = folderPath;
        const databaseFilePath = path.join(dataFolderPath, fileName);

        if (!fs.existsSync(dataFolderPath)){
            fs.mkdirSync(dataFolderPath);
        }

        if(!fs.existsSync(databaseFilePath))
        {
            console.log('Database not found. Creating empty database.');
            fs.writeFileSync(databaseFilePath, '', (error) =>
            {
                if (error)
                {
                    console.error(error.message);
                }
                else
                {
                    console.log('Created empty database.');
                }
            });
        }

        this.database = new sqlite3.Database(databaseFilePath, (error) =>
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

    createTables()
    {
        this.database.run(irakurQueries.createConfigurationTable);
        this.database.run(irakurQueries.createLanguageTable);
        this.database.run(irakurQueries.createTextTable);
        this.database.run(irakurQueries.createWordTable);
    }

    executeQuery(query, parameters = [])
    {
        return new Promise((resolve, reject) =>
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

    getFirstRow(query, parameters = [])
    {
        return new Promise((resolve, reject) =>
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
}

module.exports = new DatabaseManager('data', 'irakur.db');