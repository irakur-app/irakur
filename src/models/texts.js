const databaseManager = require('../database/databaseManager');
const textQueries = require('../database/queries/textQueries');

class Texts
{
    constructor()
    {
        this.title = "Lingua Immerse — Texts";
    }

    getTexts(languageId)
    {
        console.log("getTexts", languageId);
        return databaseManager.executeQuery(textQueries.getTexts,
            [languageId]
        );
    }
}

module.exports = Texts;