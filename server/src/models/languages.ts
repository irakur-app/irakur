/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

import { databaseManager } from '../database/databaseManager';
import { languageQueries } from '../database/queries/languageQueries';

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

    getActiveLanguage()
    {
        return databaseManager.getFirstRow(languageQueries.getActiveLanguage);
    }

    setActiveLanguage(id:string)
    {
        return databaseManager.executeQuery(languageQueries.setActiveLanguage,
            [id]
        );
    }
}

export { Languages }