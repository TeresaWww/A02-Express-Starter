import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import models from "./models.js";
import session from 'express-session';


import apiv1 from './routes/api/v1/apiv1.js';
import apiv2 from './routes/api/v2/apiv2.js';
import apiv3 from './routes/api/v3/apiv3.js';


import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use((req, _res, next) => {
    req.models = models;
    next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "This is a random secret key for session: ajhdysfgwtt",
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // logged out after1 day
    resave: false
}));

app.use('/api/v3', apiv3);

export default app;
