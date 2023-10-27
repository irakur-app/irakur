const Texts = require ('../models/texts');

class TextsController
{
    constructor()
    {
        this.texts = new Texts();
    }

    renderTexts(req, res)
    {
        this.texts.getTexts().then((texts) =>
        {
            res.render('textsView', {title: this.texts.title, texts: texts});
        });
    }
}

module.exports = TextsController;