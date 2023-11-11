import assert from 'assert';
import shoeCatalogue from '../service/shoeCatalogueDb.js';
import db from '../db.js';


const shoeService = shoeCatalogue(db);

describe('shoeCatalogue function', function () {
    // Set a timeout for the tests
    this.timeout(15000);

    const mockShoe1 = {
        brand: 'Nike',
        size: 6,
        color: 'red',
        price: 1200.00,
        in_stock: 10,
        image_url: 'https://shoes.com/nike-red.jpg'
    };

    const mockShoe2 = {
        brand: 'Adidas',
        size: 7,
        color: 'blue',
        price: 1000.00,
        in_stock: 8,
        image_url: 'https://shoes.com/adidas-blue.jpg'
    };

    const mockShoe3 = {
        brand: 'Puma',
        size: 8,
        color: 'black',
        price: 800.00,
        in_stock: 5,
        image_url: 'https://shoes.com/puma-black.jpg'
    };
    const mockShoe4 = {
        brand: 'Reebok',
        size: 5,
        color: 'red-green',
        price: 999.00,
        in_stock: 5,
        image_url: 'https://shoes.com/reebok-red-green.jpg'
    }
    const mockUser1 = {
        username: 'User1',
        email: 'k@gmail.com',
        password: 'password1',
        balance:4400.00

    };

    const mockUser2 = {
        username: 'User2',
        email: 'j@gmail.com',
        password: 'password2',
        balance: 4000.00
    };

    beforeEach(async function () {
        // Set up mock Shoe in the database
        await shoeService.addShoe( mockShoe1.brand,mockShoe1.size,mockShoe1.color,mockShoe1.price,mockShoe1.in_stock, mockShoe1.image_url);
        await shoeService.addShoe( mockShoe2.brand,mockShoe2.size,mockShoe2.color,mockShoe2.price,mockShoe1.in_stock, mockShoe2.image_url);
        await shoeService.addShoe( mockShoe3.brand,mockShoe3.size,mockShoe3.color,mockShoe3.price,mockShoe3.in_stock, mockShoe3.image_url);
        await shoeService.insertUser(mockUser1.username, mockUser1.email, mockUser1.password, mockUser1.balance);
        await shoeService.insertUser(mockUser2.username, mockUser2.email, mockUser2.password,mockUser2.balance );
    });

    afterEach(async function () {
        // Clean up mock after data each test
        await db.none('TRUNCATE TABLE shoes RESTART IDENTITY CASCADE');
        await db.none('TRUNCATE TABLE users RESTART IDENTITY CASCADE');
    });

    // Test the fetchAllShoes function
    it('should fetch all shoes from the database', async function () {
        try{
       
            // Call the fetchAllShoes function
            const allShoes = await shoeService.fetchAllShoes();

            assert.deepEqual(allShoes, [
                {
                    id: 1,
                    color: 'red',
                    brand: 'Nike',
                    price: 1200.00,
                    size: 6,
                    in_stock: 10,
                    image_url: 'https://shoes.com/nike-red.jpg'
                },
                {
                    id: 2,
                    color: 'blue',
                    brand: 'Adidas',
                    price: 1000.00,
                    size: 7,
                    in_stock: 8,
                    image_url: 'https://shoes.com/adidas-blue.jpg'
                },
                {
                    id: 3,
                    color: 'black',
                    brand: 'Puma',
                    price: 800.00,
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
        //3 conditions
        const shoesByBrand = await shoeService.fetchShoesByBrandAndSize('Nike', '');
        const shoesBySize = await shoeService.fetchShoesByBrandAndSize('', 7);
        const shoesByBrandAndSize = await shoeService.fetchShoesByBrandAndSize('Puma', 8);
        //Shoe returned
        assert.deepEqual(shoesByBrand,[{
            id: 1,
            color: 'red',
            brand: 'Nike',
            price: 1200.00,
            size: 6,
            in_stock: 10,
            image_url: 'https://shoes.com/nike-red.jpg'
        }]);

        assert.deepEqual(shoesBySize,[{
            id: 2,
            color: 'blue',
            brand: 'Adidas',
            price: 1000.00,
            size: 7,
            in_stock: 8,
            image_url: 'https://shoes.com/adidas-blue.jpg'
        }]);

        assert.deepEqual(shoesByBrandAndSize,[{
            id: 3,
            color: 'black',
            brand: 'Puma',
            price: 800.00,
            size: 8,
            in_stock: 5,
            image_url: 'https://shoes.com/puma-black.jpg'
        }]);
      }catch(error){
        console.error(error.message)
       }
    })
    // Test the addShoe function
it('should add a new shoe to the database', async function (){
    try{
      
     
        //add shoe
        await shoeService.addShoe( mockShoe4.brand,mockShoe4.size,mockShoe4.color,mockShoe4.price,mockShoe4.in_stock, mockShoe4.image_url);


        // Fetch all shoes and store the result
        const allShoes = await shoeService.fetchAllShoes();

        
        assert.deepEqual(allShoes, [
            {
                brand: 'Reebok',
                size: 5,
                color: 'red-green',
                price: 999.00,
                in_stock: 5,
                image_url: 'https://shoes.com/reebok-red-green.jpg'
            }
        ]);
    }catch(error){
        console.error(error.message)
    }

    })
    it('should add an existing shoe to the database', async function (){
        try{

    
            //add shoe
            await shoeService.addShoe( mockShoe1.brand,mockShoe1.size,mockShoe1.color,mockShoe1.price,mockShoe1.in_stock, mockShoe1.image_url);
    
            // Fetch all shoes and store the result
            const allShoes = await shoeService.fetchAllShoes();
    
            
            assert.deepEqual(allShoes, [
                {
                    id: 1,
                    color: 'red',
                    brand: 'Nike',
                    price: 1200.00,
                    size: 6,
                    in_stock: 20,
                    image_url: 'https://shoes.com/nike-red.jpg'
                }
    
            ]);
        }catch(error){
            console.error(error.message)
        }
    
        })
    

        // Test the removeShoe function
it('should subtract a specific quantity when it is above 0 from the in_stock in the database', async function (){
    try{
        const quantity = 5
        // Call the removeShoe function
        await shoeService.removeShoe(mockShoe1.id, quantity);

        // Fetch all shoes and store the result
        const allShoes = await shoeService.fetchAllShoes();

        assert.deepEqual(allShoes, [ {
            brand: 'Nike',
            size: 6,
            color: 'red',
            price: 1200.00,
            in_stock: 5,
            image_url: 'https://shoes.com/nike-red.jpg'
        }]);
    }catch(error){
        console.error(error.message)
    }
});
//Test for the addToCart function 
it('should add an item to a cart',async function(){
  
    const email = mockUser1.email;
    const imageURL = mockShoe1.image_url;
    const quantity = 2;
    var price = await db.one('SELECT price FROM shoes WHERE image_url = $1', ['https://shoes.com/nike-red.jpg']);
    const result = await shoeService.addToCart(email, imageURL, quantity, price);

    assert.equal(result.success, true);
    assert.equal(result.message, 'Cart updated successfully');
  
   
})
//Test for the getCart function
it('should get the users cart', async function () {
    const email = mockUser1.email;
    const imageURL1 = mockShoe1.image_url;
    const imageURL2 = mockShoe2.image_url;
    var mockShoe1Price = await db.one('SELECT price FROM shoes WHERE image_url = $1', ['https://shoes.com/nike-red.jpg']);
    var mockShoe2Price = await db.one('SELECT price FROM shoes WHERE image_url = $1', ['https://shoes.com/adidas-blue.jpg']);

    const quantity = 2;

      await shoeService.addToCart(email, imageURL1, quantity, mockShoe1Price)
      await shoeService.addToCart(email, imageURL2, quantity, mockShoe2Price)

    const cart1= await shoeService.getUserCart(email); 
    const result = {
    cartItems:[
            {
                "imgurl": "https://shoes.com/nike-red.jpg",
                "price": 1200.00,
                "quantity": 2
          
        },
        {
            "imgurl": "https://shoes.com/adidas-blue.jpg",
             "price":1000.00,
            "quantity": 2
      
     
    }],
    totalPrice:4400}

    assert.deepEqual(cart1, result)
  });
//test for the checkout function 
it('should checkout a cart when the balance is enough', async function () {
    const email = mockUser1.email;
    const imageURL1 = mockShoe1.image_url;
    var mockShoe1Price = await db.one('SELECT price FROM shoes WHERE image_url = $1', ['https://shoes.com/nike-red.jpg']);
    const quantity = 2;
    //add to cart
      await shoeService.addToCart(email, imageURL1, quantity, mockShoe1Price)
    //get cart
   await shoeService.getUserCart(email); 
   //checkout
    const result = await shoeService.checkout(email)
   assert.equal(result.success,true )
   assert.equal(result.message, 'Checkout successful!')
});
it('should throw an error checkout for a cart when the balance is not enough', async function () {
 
    const email = mockUser1.email;
    const imageURL1 = mockShoe1.image_url;
    const imageURL2 = mockShoe2.image_url;
    var mockShoe1Price = await db.one('SELECT price FROM shoes WHERE image_url = $1', ['https://shoes.com/nike-red.jpg']);
    var mockShoe2Price = await db.one('SELECT price FROM shoes WHERE image_url = $1', ['https://shoes.com/adidas-blue.jpg']);
    const quantity = 3;

    //add to cart
      await shoeService.addToCart(email, imageURL1, quantity,mockShoe1Price)
      await shoeService.addToCart(email, imageURL2, quantity,mockShoe2Price)

    //get cart
   await shoeService.getUserCart(email); 
   //checkout
   try {
    await shoeService.checkout(email);
} catch (error) {
    assert.equal(error.message, 'Insufficient funds');

}
});
    after(function () {
        db.$pool.end();}
    )
});