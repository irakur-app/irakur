const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');

//settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middlewares
app.use(morgan('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));

//routes
app.use('/', require('./routers/indexRouter'));
app.use('/settings/', require('./routers/settingsRouter'));
app.use('/languages/', require('./routers/languagesRouter'));
app.use('/texts/', require('./routers/textsRouter'));

app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});