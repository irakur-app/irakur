/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { databaseManager } from "../database/database-manager";
import { textQueries } from "../database/queries/text-queries";

class Texts
{
    title:string;

    constructor()
    {
        this.title = "Irakur — Texts";
    }

    getTexts(languageId:string)
    {
        console.log("getTexts", languageId);
        return databaseManager.executeQuery(textQueries.getTexts,
            [languageId]
        );
    }

    getText(id:string)
    {
        console.log("getText", id);
        return databaseManager.getFirstRow(textQueries.getText,
            [id]
        );
    }

    addText(languageId:string, title:string, content:string, sourceUrl:string)
    {
        console.log("addText", languageId, title, content, sourceUrl);
        return databaseManager.executeQuery(textQueries.addText,
            [languageId, title, content, sourceUrl]
        );
    }

    deleteText(id:string)
    {
        console.log("deleteText", id);
        return databaseManager.executeQuery(textQueries.deleteText,
            [id]
        );
    }

    editText(id:string, title:string, content:string, sourceUrl:string)
    {
        console.log("editText", id, title, content, sourceUrl);
        return databaseManager.executeQuery(textQueries.editText,
            [title, content, sourceUrl, id]
        );
    }
}

export { Texts };