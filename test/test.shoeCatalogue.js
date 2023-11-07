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
                   //mock data
        var shoeColor1 = "red"; var shoeColor2 = 'blue'; var shoeColor3 = 'black';
        var shoeBrand1 = 'Nike'; var shoeBrand2 = Adidas; var shoeBrand3 = 'Puma';
        var price1 = 1200; var price2 = 1000; var price3 = 800;
        var size1 = 6; var size2 = 7; var size3 = 8; 
        var available1 = 10; var available2 = 8; var available3 = 5; 
        var img1 ='https://shoes.com/nike-red.jpg' ; var img2 = 'https://shoes.com/adidas-blue.jpg'; var img3 = 'https://shoes.com/puma-black.jpg'; 
        //add shoes
        await shoeService.addShoe( shoeBrand1,size1,shoeColor1,price1,available1,img1);
        await shoeService.addShoe( shoeBrand2,size2,shoeColor2,price2,available2,img2);
        await shoeService.addShoe( shoeBrand1,size3,shoeColor3,price3,available3,img3);
            // Call the fetchAllShoes function
            const allShoes = await shoeService.fetchAllShoes();

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
        var shoeColor1 = 'red'; var shoeColor2 = 'blue'; var shoeColor3 = 'black';
        var shoeBrand1 = 'Nike'; var shoeBrand2 = Adidas; var shoeBrand3 = 'Puma';
        var price1 = 1200; var price2 = 1000; var price3 = 800;
        var size1 = 6; var size2 = 7; var size3 = 8; 
        var available1 = 10; var available2 = 8; var available3 = 5; 
        var img1 ='https://shoes.com/nike-red.jpg' ; var img2 = 'https://shoes.com/adidas-blue.jpg'; var img3 = 'https://shoes.com/puma-black.jpg'; 
        //add shoes
        await shoeService.addShoe( shoeBrand1,size1,shoeColor1,price1,available1,img1);
        await shoeService.addShoe( shoeBrand2,size2,shoeColor2,price2,available2,img2);
        await shoeService.addShoe( shoeBrand1,size3,shoeColor3,price3,available3,img3);
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
    // Test the addShoe function
it('should add a shoe to the database', async function (){
    try{
//mock data
        var shoeColor1 = 'green';
        var shoeBrand1 = 'Reebok';
        var price1 = 900;
        var size1 = 9;
        var available1 = 7;
        var img1 = 'https://shoes.com/reebok-green.jpg'; 

        //add shoe
        await shoeService.addShoe( shoeBrand1,size1,shoeColor1,price1,available1,img1);

        // Fetch all shoes and store the result
        const allShoes = await shoeService.fetchAllShoes();

        
        assert.deepEqual(allShoes, [
            {
                id: 1,
                color: 'green',
                brand: 'Reebok',
                price: 900,
                size: 9,
                in_stock: 7,
                image_url: 'https://shoes.com/reebok-green.jpg'
            }

        ]);
    }catch(error){
        console.error(error.message)
    }

    })

        // Test the removeShoe function
it('should remove a shoe from the database', async function (){
    try{
       //mock data
       var shoeColor1 = 'green';
       var shoeBrand1 = 'Reebok';
       var price1 = 900;
       var size1 = 9;
       var available1 = 7;
       var img1 = 'https://shoes.com/reebok-green.jpg'; 

       //add shoe
       await shoeService.addShoe(shoeColor1, shoeBrand1, price1, size1, available1, img1);

        // Call the removeShoe function
        await shoeService.removeShoe(1);

        // Fetch all shoes and store the result
        const allShoes = await shoeService.fetchAllShoes();

        assert.deepEqual(allShoes, []);
    }catch(error){
        console.error(error.message)
    }
});
//Test for the getCart function
it('should get the users cart', async function () {
     //mock data
     var shoeColor1 = 'green';
     var shoeBrand1 = 'Reebok';
     var price1 = 900;
     var size1 = 9;
     var available1 = 7;
     var img1 = 'https://shoes.com/reebok-green.jpg'; 

     var shoeColor2 = 'navy';
     var shoeBrand2 = 'Adidas';
     var price2 = 1199;
     var size2 = 7;
     var available2 = 4;
     var img2= 'https://shoes.com/adidas-navy.jpg'; 

     //add shoe
     await shoeService.addShoe( shoeBrand1,size1,shoeColor1,price1,available1,img1);
     await shoeService.addShoe( shoeBrand2,size2,shoeColor2,price2,available2,img2);

    const userCart1 = [
      {imgurl:'https://shoes.com/reebok-green.jpg', quantity: 2 }
    ];
    const userCart2 = [
        {imgurl:'https://shoes.com/adidas-navy.jpg', quantity: 1 }
      ];
let user1 = 'k@gmail.com';
let user2 = 'j@gmail.com';



    await shoeService.insertUser('User1', user1, 'password1');
    await shoeService.insertUser('User2', user2, 'password2');
    await shoeService.addToCart(user1,'https://shoes.com/reebok-green.jpg' , 2);
    await shoeService.addToCart(user2,'https://shoes.com/adidas-navy.jpg',1);
    const cart1= await shoeService.getUserCart(user1); 
    const cart2 = await shoeService.getUserCart(user2);


    assert.deepEqual(cart1, userCart1);
    assert.deepEqual(cart2, userCart2)
  });

    after(function () {
        db.$pool.end();}
    )
});