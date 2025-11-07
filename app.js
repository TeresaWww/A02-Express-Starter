import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import models from "./models.js";
import session from 'express-session';
import WebAppAuthProvider from 'msal-node-wrapper'


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

const authConfig = {
    auth: {
        clientId: "9e6b9f75-6fef-4d77-8aea-f87a151aa68b",
        authority: "https://login.microsoftonline.com/f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret: "qjO8Q~KYnnZitUaMTWeomtnBikQkXNscqW-bUdqw",
        redirectUri: "/redirect"
    },
	system: {
    	loggerOptions: {
        	loggerCallback(loglevel, message, containsPii) {
            	console.log(message);
        	},
        	piiLoggingEnabled: false,
        	logLevel: 3,
    	}
	}
};

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

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig);
app.use(authProvider.authenticate());

app.use('/api/v3', apiv3);

app.get('/signin', (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/", // redirect here after login
    })(req, res, next);

});
app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/", // redirect here after logout
    })(req, res, next);

});
app.use(authProvider.interactionErrorHandler());

export default app;
