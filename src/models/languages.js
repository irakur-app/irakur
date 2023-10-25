const databaseManager = require('../database/databaseManager');

class Languages
{
    constructor()
    {
        this.title = "Lingua Immerse — Languages";
        this.languages = [];
        databaseManager.getLanguages()
            .then((languages) =>
            {
                this.languages = languages;
            })
            .catch((error) =>
            {
                console.error(error);
            });
    }
}

module.exports = Languages;