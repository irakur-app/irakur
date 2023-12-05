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

    renderAddText(req, res)
    {
        this.languages.getActiveLanguage().then((activeLanguage) =>
        {
            res.render('addTextView', {title: this.texts.title, language: activeLanguage});
        });
    }

    addText(req, res)
    {
        this.languages.getActiveLanguage().then((activeLanguage) =>
        {
            this.texts.addText(activeLanguage.id, req.body.title, req.body.content, req.body.sourceUrl).then(() =>
            {
                res.redirect('/texts');
            });
        });
    }
}

module.exports = TextsController;