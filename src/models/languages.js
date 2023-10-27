const databaseManager = require('../database/databaseManager');
const languageQueries = require('../database/queries/languageQueries');

class Languages
{
    constructor()
    {
        this.title = "Lingua Immerse — Languages";
    }

    getLanguages()
    {
        return databaseManager.executeQuery(languageQueries.getLanguages);
    }

    getLanguage(id)
    {
        return databaseManager.getFirstRow(languageQueries.getLanguage,
            [id]
        );
    }

    addLanguage(name, dictionaryUrl, shouldShowSpaces)
    {
        return databaseManager.executeQuery(languageQueries.addLanguage,
            [name, dictionaryUrl, shouldShowSpaces]
        );
    }

    deleteLanguage(id)
    {
        return databaseManager.executeQuery(languageQueries.deleteLanguage,
            [id]
        );
    }

    editLanguage(id, name, dictionaryUrl, shouldShowSpaces)
    {
        return databaseManager.executeQuery(languageQueries.editLanguage,
            [name, dictionaryUrl, shouldShowSpaces, id]
        );
    }

    getActiveLanguage()
    {
        return databaseManager.getFirstRow(languageQueries.getActiveLanguage);
    }

    setActiveLanguage(id)
    {
        return databaseManager.executeQuery(languageQueries.setActiveLanguage,
            [id]
        );
    }
}

module.exports = Languages;