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

    addText(languageId, title, content, sourceUrl)
    {
        console.log("addText", languageId, title, content, sourceUrl);
        return databaseManager.executeQuery(textQueries.addText,
            [languageId, title, content, sourceUrl]
        );
    }

    deleteText(id)
    {
        console.log("deleteText", id);
        return databaseManager.executeQuery(textQueries.deleteText,
            [id]
        );
    }
}

module.exports = Texts;