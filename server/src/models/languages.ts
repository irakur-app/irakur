/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { databaseManager } from '../database/database-manager';
import { languageQueries } from '../database/queries/language-queries';

class Languages
{
    title:string;

    constructor()
    {
        this.title = "Irakur — Languages";
    }

    getLanguages()
    {
        return databaseManager.executeQuery(languageQueries.getLanguages);
    }

    getLanguage(id:string)
    {
        return databaseManager.getFirstRow(languageQueries.getLanguage,
            [id]
        );
    }

    addLanguage(name:string, dictionaryUrl:string, shouldShowSpaces:boolean)
    {
        return databaseManager.executeQuery(languageQueries.addLanguage,
            [name, dictionaryUrl, shouldShowSpaces.toString()]
        );
    }

    deleteLanguage(id:string)
    {
        return databaseManager.executeQuery(languageQueries.deleteLanguage,
            [id]
        );
    }

    editLanguage(id:string, name:string, dictionaryUrl:string, shouldShowSpaces:boolean)
    {
        return databaseManager.executeQuery(languageQueries.editLanguage,
            [name, dictionaryUrl, shouldShowSpaces.toString(), id]
        );
    }
}

export { Languages }