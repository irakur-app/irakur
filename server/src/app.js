/* 
 * Irakur - Learn languages through immersion
 * Copyright (C) 2023-2024 Ander "Laquin" Aginaga San Sebastián
 * Licensed under version 3 of the GNU Affero General Public License
 */

const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');

const cors = require('cors');
app.use(cors());

//settings
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middlewares
app.use(morgan('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));

//routes
app.use('/api', require('./routers/apiRouter'));

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});