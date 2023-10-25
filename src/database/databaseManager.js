const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const linguaImmerseQueries = require('./queries/linguaImmerseQueries');
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
                console.log('Connected to the Lingua Immerse database.');
            }
        });

        this.createTables();

        DatabaseManager.instance = this;
    }

    createTables()
    {
        this.database.run(linguaImmerseQueries.createConfigurationTable);
        this.database.run(linguaImmerseQueries.createLanguageTable);
        this.database.run(linguaImmerseQueries.createTextTable);
        this.database.run(linguaImmerseQueries.createWordTable);
    }

    getLanguages()
    {
        return new Promise((resolve, reject) =>
        {
            this.database.all(languageQueries.getLanguages, [], (error, rows) =>
            {
                if(error)
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
}

module.exports = new DatabaseManager('data', 'linguaImmerse.db');