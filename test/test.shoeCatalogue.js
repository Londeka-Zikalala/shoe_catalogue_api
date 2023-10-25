import assert from 'assert';
import shoeCatalogue from '../service/shoeCatalogueDb.js';
import db from '../db.js';


const shoeService = shoeCatalogue(db);

describe('shoeCatalogue function', function () {
    // Set a timeout for the tests
    this.timeout(6000);

    // Clean the shoes table before each test
    beforeEach(async function () {
       try{
         await db.none("TRUNCATE TABLE shoes RESTART IDENTITY CASCADE;");
       }catch(error){
        console.error(error.message)
       }
    })

    // Test the fetchAllShoes function
    it('should fetch all shoes from the database', async function () {
        try{
            // Insert some mock data into the shoes table
            await db.none('INSERT INTO shoes (color, brand, price, size, in_stock,image_url) VALUES ($1, $2, $3 , $4, $5,$6)', ['red', 'Nike', 1200, 6, 10,'https://shoes.com/nike-red.jpg']);
            await db.none('INSERT INTO shoes (color, brand, price, size, in_stock,image_url) VALUES ($1, $2, $3 , $4, $5,$6)', ['blue', 'Adidas', 1000, 7, 8,'https://shoes.com/adidas-blue.jpg']);
            await db.none('INSERT INTO shoes (color, brand, price, size, in_stock,image_url) VALUES ($1, $2, $3 , $4, $5,$6)', ['black', 'Puma', 800, 8, 5,'https://shoes.com/puma-black.jpg']);

            // Call the fetchAllShoes function and store the result
            const allShoes = await shoeService.fetchAllShoes();

            // Assert that the result is an array of three objects with the expected properties and values
            assert.deepEqual(allShoes, [
                {
                    id: 1,
                    color: 'red',
                    brand: 'Nike',
                    price: 1200,
                    size: 6,
                    in_stock: 10,
                    image_url: 'https://shoes.com/nike-red.jpg'
                },
                {
                    id: 2,
                    color: 'blue',
                    brand: 'Adidas',
                    price: 1000,
                    size: 7,
                    in_stock: 8,
                    image_url: 'https://shoes.com/adidas-blue.jpg'
                },
                {
                    id: 3,
                    color: 'black',
                    brand: 'Puma',
                    price: 800,
                    size: 8,
                    in_stock: 5,
                    image_url: 'https://shoes.com/puma-black.jpg'
                }
            ]);
        }catch(error){
            console.error(error.message)
        }
        
    });

    // Test the fetchShoesByBrandAndSize function
    it('should fetch shoes by brand and size from the database', async function (){
      try{
        //mock data
        await db.none('INSERT INTO shoes (color, brand, price, size, in_stock,image_url) VALUES ($1, $2, $3 , $4, $5,$6)', ['red', 'Nike', 1200, 6, 10,'https://shoes.com/nike-red.jpg']);
        await db.none('INSERT INTO shoes (color, brand, price, size, in_stock,image_url) VALUES ($1, $2, $3 , $4, $5,$6)', ['blue', 'Adidas', 1000, 7, 8,'https://shoes.com/adidas-blue.jpg']);
        await db.none('INSERT INTO shoes (color, brand, price, size, in_stock,image_url) VALUES ($1, $2, $3 , $4, $5,$6)', ['black', 'Puma', 800, 8, 5,'https://shoes.com/puma-black.jpg']);

        //3 conditions
        const shoesByBrand = await shoeService.fetchShoesByBrandAndSize('Nike', '');
        const shoesBySize = await shoeService.fetchShoesByBrandAndSize('', 7);
        const shoesByBrandAndSize = await shoeService.fetchShoesByBrandAndSize('Puma', 8);
        //data returned
        assert.deepEqual(shoesByBrand,[{
            id: 1,
            color: 'red',
            brand: 'Nike',
            price: 1200,
            size: 6,
            in_stock: 10,
            image_url: 'https://shoes.com/nike-red.jpg'
        }]);

        assert.deepEqual(shoesBySize,[{
            id: 2,
            color: 'blue',
            brand: 'Adidas',
            price: 1000,
            size: 7,
            in_stock: 8,
            image_url: 'https://shoes.com/adidas-blue.jpg'
        }]);

        assert.deepEqual(shoesByBrandAndSize,[{
            id: 3,
            color: 'black',
            brand: 'Puma',
            price: 800,
            size: 8,
            in_stock: 5,
            image_url: 'https://shoes.com/puma-black.jpg'
        }]);
      }catch(error){
        console.error(error.message)
       }
    })
    after(function () {
        db.$pool.end();}
    )
});