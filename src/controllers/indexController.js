const Index = require ('../models/index');

class IndexController
{
    constructor()
    {
        this.index = new Index();
    }

    renderIndex(req, res)
    {
        res.render('indexView', {title: this.index.title, links: this.index.links});
    }
}

module.exports = IndexController;