// load .env data into process.env
import dotenv from 'dotenv';
dotenv.config();

const db = require('./db/connection');
import express, { Express } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import methodOverride from 'method-override';

const app: Express = express();
const port = process.env.PORT || 8080;

// Express Configuration
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieSession({
  name: process.env.SESSION_NAME,
  keys: [process.env.SESSION_KEY]
}));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Routes
const userRoutes = require('./routes/users');
const mapRoutes = require('./routes/maps');
const pinRoutes = require('./routes/pins');
const searchRoutes = require('./routes/search');

app.use('/', userRoutes(db));
app.use('/', mapRoutes(db));
app.use('/', pinRoutes(db));
app.use('/', searchRoutes(db));


app.listen(port, () => {
  console.log(`Express is listening on port ${port}!`);
});
