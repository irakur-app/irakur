var Index = require ('../models/index');

class IndexController
{
    constructor()
    {
        this.index = new Index();
    }

    renderIndex(req, res)
    {
        res.render('index', {index: this.index});
    }
}

module.exports = IndexController;