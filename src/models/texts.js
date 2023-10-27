const databaseManager = require('../database/databaseManager');
const textQueries = require('../database/queries/textQueries');

class Texts
{
    constructor()
    {
        this.title = "Lingua Immerse — Texts";
    }

    getTexts()
    {
        return databaseManager.executeQuery(textQueries.getTexts);
    }
}

module.exports = Texts;