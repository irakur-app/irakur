/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

class Home
{
    constructor()
    {
        this.title = "Irakur";
        this.links =
        [
            {name: 'texts', url: '/texts'},
            {name: 'languages', url: '/languages'},
            {name: 'statistics', url: '/statistics'},
            {name: 'settings', url: '/settings'}
        ];
    }
};
  
module.exports = Home;