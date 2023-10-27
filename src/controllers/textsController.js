const Texts = require ('../models/texts');
const Languages = require ('../models/languages');

class TextsController
{
    constructor()
    {
        this.texts = new Texts();
        this.languages = new Languages();
    }

    renderTexts(req, res)
    {
        this.languages.getActiveLanguage().then((activeLanguage) =>
        {
            this.texts.getTexts(activeLanguage.id).then((texts) =>
            {
                res.render('textsView', {title: this.texts.title, texts: texts});
            });
        });
    }
}

module.exports = TextsController;