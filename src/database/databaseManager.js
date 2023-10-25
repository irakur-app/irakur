const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const dataFolderPath = './data/';
const databaseFilePath = dataFolderPath + 'linguaImmerse.db';

class DatabaseManager
{
    constructor()
    {
        if(DatabaseManager.instance)
        {
            return DatabaseManager.instance;
        }

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

        DatabaseManager.instance = this;
    }
}

module.exports = new DatabaseManager();