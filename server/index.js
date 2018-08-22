require('dotenv').config();

const path = require('path');

const cors = require('cors');

const express = require('express');
const bodyParser = require('body-parser');

const { router } = require('./routers');

const app = express();

const whitelist = [
    'http://localhost:4200',
];
const corsOptions = {
    origin(origin, callback){
        const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/', router);
app.use(express.static(path.join(__dirname, './public/')));

app.listen(process.env.PORT, () => console.log(`Express app listening on ${process.env.HOST}:${process.env.PORT}`));
