import express from 'express';
import {engine} from 'express-handlebars'
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import cors from 'cors';
import shoeCatalogue from './service/shoeCatalogueDb.js';
import shoeCatalogueRoute from './shoeCatalogueRoutes/shoeCatalogueRoutesi.js';
import shoesAPI from './shoeCatalogue-api/shoeCatalogue-api.js';
import db from './db.js';

const app = express();
const shoesdb = shoeCatalogue(db)
const shoesRoute = shoeCatalogueRoute(shoesdb)
const shoeAPI = shoesAPI(shoesdb)

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

//route handlers
app.get('/', shoesRoute.showIndex);
app.get('/shoes', shoesRoute.listAllShoes);
app.post('/stock-update/shoes', shoesRoute.addAShoe);
app.get('/stock-update/shoes', shoesRoute.showStockUpdate)
app.get('/shoes/brand//size', shoesRoute.listShoesByBrandAndSize);
app.get('/shoes/brand/:brand/size/:size', shoesRoute.listShoesByBrandAndSize);
app.post('/stock-update/shoes/sold', shoesRoute.removeAShoe )

//API 
app.get('/api/shoes', shoeAPI.allShoes);
app.post('/api/shoes', shoeAPI.addShoes);
app.post('/api/shoes/sold/:id', shoeAPI.deleteShoe)
app.get('/api/shoes/brand/:brand/size/:size', shoeAPI.getShoesBySizeAndBrand);

//local host 
const PORT = process.env.PORT || 3011

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});