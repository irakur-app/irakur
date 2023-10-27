const Index = require ('../models/index');
const Languages = require ('../models/languages');

class IndexController
{
    constructor()
    {
        this.index = new Index();
        this.languages = new Languages();
    }

    renderIndex(req, res)
    {
        this.languages.getLanguages().then((languages) =>
        {
            this.languages.getActiveLanguage().then((activeLanguage) =>
            {
                console.log(activeLanguage);
                res.render('indexView', {title: this.index.title, links: this.index.links, languages: languages, activeLanguage: activeLanguage});
            });
        });
    }
}

module.exports = IndexController;