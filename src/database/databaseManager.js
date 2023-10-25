const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

class DatabaseManager
{
    constructor()
    {
        if(DatabaseManager.instance)
        {
            return DatabaseManager.instance;
        }

        if(!fs.existsSync('./data/linguaImmerse.db'))
        {
            console.log('Database not found. Creating empty database.');
            fs.writeFile('./data/linguaImmerse.db', '', (error) =>
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

        this.database = new sqlite3.Database('./data/linguaImmerse.db', (error) =>
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