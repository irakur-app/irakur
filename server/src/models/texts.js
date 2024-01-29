/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const databaseManager = require('../database/databaseManager');
const textQueries = require('../database/queries/textQueries');

class Texts
{
    constructor()
    {
        this.title = "Irakur — Texts";
    }

    getTexts(languageId)
    {
        console.log("getTexts", languageId);
        return databaseManager.executeQuery(textQueries.getTexts,
            [languageId]
        );
    }

    getText(id)
    {
        console.log("getText", id);
        return databaseManager.getFirstRow(textQueries.getText,
            [id]
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

    editText(id, title, content, sourceUrl)
    {
        console.log("editText", id, title, content, sourceUrl);
        return databaseManager.executeQuery(textQueries.editText,
            [title, content, sourceUrl, id]
        );
    }
}

module.exports = Texts;