import express from 'express';
import {engine} from 'express-handlebars'
import bodyParser from 'body-parser';
import flash from 'express-flash';
import session from 'express-session';
import cors from 'cors';
import axios from 'axios';
import shoeCatalogue from './service/shoeCatalogueDb.js';
import shoeCatalogueRoute from './shoeCatalogueRoutes/shoeCatalogueRoutesi.js';
import shoesAPI from './API/shoeCatalogue-api.js';
import userAPI from './API/usersAPI.js';
import adminAPI from './API/adminAPI.js';
import db from './db.js';

const app = express();
const shoesdb = shoeCatalogue(db)
const shoesRoute = shoeCatalogueRoute(shoesdb)
const shoeAPI = shoesAPI(shoesdb)
const users = userAPI(shoesdb)
const admin = adminAPI(shoesdb)

// Set the Permissions-Policy header
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  next();
});

//cors middleware
app.use(cors())

//axios 
console.log(axios.isCancel('something'));
//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SECRET_KEY,
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
app.get('/shoes/brand/:brand?/size/:size?', shoesRoute.listShoesByBrandAndSize);
app.post('/stock-update/shoes/sold', shoesRoute.removeAShoe )

//shoes API
app.get('/api/shoes', shoeAPI.allShoes);
app.get('/api/shoes/brand/:brand', shoeAPI.getShoesByBrand);
app.get('/api/shoes/size/:size', shoeAPI.getShoesBySize);
app.get('/api/shoes/brand/:brand?/size/:size?', shoeAPI.getShoesBySizeAndBrand);

//Users API
app.post('/api/users', users.registerUser);
app.get('/api/users/:email', users.fetchUserBalance)
app.post('/api/users/cart', users.addToCart);
app.get('/api/users/cart/:email', users.getCart);
app.post('/api/users/checkout/:email', users.checkout);
app.post('/api/users/login', users.loginUser);
app.post('/api/users/logout', users.userLogout);
app.post('/api/users/type', users.userRole);
app.get('/api/users/type', users.userRole);

//Admin API
app.post('/api/admin', admin.addShoes);
app.post('/api/admin/stock', admin.allShoesWithColorCode);
app.get('/api/admin/stock', admin.allShoesWithColorCode);
app.post('/api/admin/sold', admin.deleteInStock);
app.post('/api/admin/delete/:id', admin.removeEntireStock);
app.get('/api/admin/soldout', admin.getOutOfStockShoes);

//local host 
const PORT = process.env.PORT || 3011

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
