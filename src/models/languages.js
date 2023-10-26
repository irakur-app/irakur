const databaseManager = require('../database/databaseManager');

class Languages
{
    constructor()
    {
        this.title = "Lingua Immerse — Languages";
    }

    getLanguages()
    {
        return databaseManager.getLanguages();
    }
}

module.exports = Languages;