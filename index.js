import express from 'express';
import {engine} from 'express-handlebars'
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import cors from 'cors';
import shoeCatalogue from './service/shoeCatalogueDb.js';
import shoeCatalogueRoute from './shoeCatalogueRoutes/shoeCatalogue-api.js';
import db from './db.js';

const app = express();
const shoesdb = shoeCatalogue(db)
const shoesRoute = shoeCatalogueRoute(shoesdb)

//cors middleware
app.use(cors())
//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'edeea0c7-8aed-40c3-afab-48a3c5cdd878',
    resave: false,
    saveUninitialized: true
  }));
app.use(flash());
//handlebars engine



app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
//public static
app.use(express.static('public'));

app.get('/', shoesRoute.showIndex);
app.get('/api/shoes', shoesRoute.listAllShoes);
app.get('/api/shoes/size', shoesRoute.listShoesBySize);
app.get('/api/shoes/size/:size', shoesRoute.listShoesBySize );
app.get('/api/shoes/brand', shoesRoute.listShoesByBrand);
app.get('/api/shoes/brand/:brand', shoesRoute.listShoesByBrand);
app.get('/api/shoes/brand//size/', shoesRoute.listShoesByBrandAndSize);
app.get('/api/shoes/brand/:brand/size/:size', shoesRoute.listShoesByBrandAndSize);


//local host 
const PORT = process.env.PORT || 3011

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});