const Index = require('../models/index');

const IndexController = {
  getIndexPage: (req, res) => {    
    console.log(Index.links[0].url);
    res.render('index', { Index: Index });
  },
};

module.exports = IndexController;
