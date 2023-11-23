function shoeCatalogue(db) {
/**FECTHING AND ADDING SHOES*/
    async function fetchAllShoes() {
        const availableShoes = await db.manyOrNone('SELECT * FROM shoes WHERE in_stock > 0')

        return availableShoes
    }

    async function fetchShoesByBrandAndSize(brandName, shoeSize) {
        let shoes;
        if (brandName && shoeSize) {
            shoes = await db.manyOrNone('SELECT * FROM shoes WHERE brand=$1 AND size=$2 AND in_stock > 0', [brandName, shoeSize])
        }
        else if (brandName || shoeSize) {
            if (brandName) {
                shoes = await db.manyOrNone('SELECT * FROM shoes WHERE brand=$1 AND in_stock > 0', [brandName]);
            } else {
                shoes = await db.manyOrNone('SELECT * FROM shoes WHERE size=$1 AND in_stock > 0', [shoeSize]);
            }
        }

        else {
            // return all shoes if both brandName and shoeSize are not provided
            shoes = await db.manyOrNone('SELECT * FROM shoes')
        }
        return shoes
    }

    async function fetchShoesByBrand(brandName) {
        return await db.manyOrNone('SELECT * FROM shoes WHERE brand=$1 AND in_stock > 0', [brandName])
    }

    async function fetchShoesBySize(shoeSize) {
        return await db.manyOrNone('SELECT * FROM shoes WHERE size=$1 AND in_stock > 0', [shoeSize])
    }

    async function fetchSoldOutShoes(){
        try{
            const soldOut = await db.manyOrNone('SELECT * FROM shoes WHERE in_stock <= 0');
            return soldOut
        }catch(error){
            throw new Error('Error fetching shoes')
        }
    }
    function getStockColorCodes(inStock){
        if(inStock < 3){
            return 'red'
        }else if(inStock >= 3 && inStock < 5){
            return 'orange'
        }
        else if(inStock > 5){
            return 'green'
        }
    }

async function fetchAllShoesWithColorCode(){
    try{
        const allShoes = await db.manyOrNone('SELECT * FROM shoes')
        for (let i = 0; i < allShoes.length; i++) {
            allShoes[i].colorCode = getStockColorCodes(allShoes[i].in_stock);
        }
        return allShoes
    }catch(error){
        console.error(error.message);
    }
}

    async function addShoe(brandName, shoeSize, shoeColor, shoePrice, inStock, imageURL) {
        try {
            // Check if shoe exists
            const shoe = await db.oneOrNone('SELECT * FROM shoes WHERE image_url = $1', [imageURL]);

        if (shoe !== null) {
        // Update in_stock for existing shoe
        const newInStock = Number(shoe.in_stock) + Number(inStock);
        await db.none('UPDATE shoes SET in_stock = $1 WHERE image_url = $2', [newInStock,imageURL]);
            } else {
         // If shoe does not exist, insert new shoe
        await db.none('INSERT INTO shoes (brand, size, color, price, in_stock, image_url) VALUES ($1, $2, $3 , $4, $5, $6)', [brandName, shoeSize, shoeColor, shoePrice, inStock, imageURL]);
            }
        } catch (error) {
            console.error(error.message);

        }
    }

    async function getShoeId(imageURL) {
        let shoeId = await db.oneOrNone('SELECT id FROM shoes WHERE image_url = $1', [imageURL])
        let shoeID = shoeId.id;
        return shoeID
    }
/***********REMOVING OR DELETING SHOES***************** */
    async function removeShoe(imageURL, quantity) {
        try {
           let shoeId = await getShoeId(imageURL)
           console.log(shoeId)
            let stockAvailable = await db.one('SELECT in_stock FROM shoes WHERE id = $1', [shoeId]);
            
            if (stockAvailable.in_stock > 0 && stockAvailable.in_stock >= quantity) {
                // Reduce the stock by the specified quantity
                await db.none('UPDATE shoes SET in_stock = in_stock - $1 WHERE id = $2', [quantity, shoeId]);
            }
            
        } catch (error) {
            console.error(error.message);

        }
    }

    async function deleteShoes(shoeId){
        try{
            await db.none('DELETE FROM shoes WHERE id = $1', [shoeId])
        }catch(error){
            throw new Error('Error deleting shoe')        }
    }

    /************USER FUNCTIONS************** */

    ///INSERT USER
    async function insertUser(username, email, password, balance) {
        try {
            // Check if user already exists
            const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    
            // If user does not exist, insert new user
            if (!user) {
                await db.none('INSERT INTO users (username, email, password, balance) VALUES ($1, $2, $3, $4)', [username, email, password, balance]);
            //get the id
                return await getUserId(email)
            } else {
                let oldBalance = user.balance
                console.log(oldBalance)
                let newBalance = Number(user.balance) + balance;
                 //update the balance
                updateUserBalance(email, newBalance)

                //get the user id
               return await getUserId(email)
               
            }
        } catch (error) {
            console.error(error.message);
        }
    }
    
/// GET USER ID
    async function getUserId(email) {
        let userId = await db.oneOrNone('SELECT id FROM users WHERE email = $1', [email])
        let userID = userId.id
        return userID
    }
/////GET USER
    async function getUser(email){
        let user = await db.manyOrNone('SELECT * FROM users WHERE email = $1', [email]);
        console.log(user)
        return user
    }
    ///GET USER BALANCE
    async function getUserBalance(email) {
        try {
            const user = await db.one('SELECT balance FROM users WHERE email = $1', [email]);
            let userBalance = user.balance
            return userBalance
        } catch (error) {
            throw new Error('Error fetching user balance');
        }
    }
    /////UPDATE USER BALANCE
    async function updateUserBalance(email, balance) {
        try {
            await db.none('UPDATE users SET balance = $1 WHERE email = $2', [balance, email]);
        } catch (error) {
            throw new Error('Error updating user balance');
        }
    }


    /*******************CART AND CHECKOUT************************** */

    ////ADD TO CART
    async function addToCart(email, imageURL, quantity) {
        try {
            let userId = await getUserId(email);
            let shoeId = await getShoeId(imageURL);
                  // Check if the shoe is in stock
        let shoeStock = await db.one('SELECT in_stock FROM shoes WHERE id = $1', [shoeId]);
        if (shoeStock.in_stock < quantity) {
            throw new Error('Not enough stock');
        }
            // Check if the user already picked the shoe
            const alreadySelected = await db.oneOrNone('SELECT * FROM shoes_cart WHERE user_id = $1 AND shoe_id = $2', [userId, shoeId]);
            // Get the shoe price 
            let shoePrice = await db.one('SELECT price FROM shoes WHERE id = $1', [shoeId])
            if (alreadySelected) {
                // Update quantity if item already exists in the cart

                const newQuantity = alreadySelected.quantity + quantity;
                const newPrice = shoePrice.price * newQuantity;
    
                await db.none('UPDATE shoes_cart SET quantity = $1, price = $2 WHERE user_id = $3 AND shoe_id = $4', [newQuantity, newPrice, userId, shoeId]);
            } else {
                // Add new item to the cart
                const newPrice = shoePrice.price * quantity;
                await db.none('INSERT INTO shoes_cart (user_id, shoe_id, quantity, price) VALUES ($1, $2, $3, $4)', [userId, shoeId, quantity, newPrice]);
            }
    
            return { success: true, message: 'Cart updated successfully' };
        } catch (error) {
            console.error(error.message, error);
            return { success: false, message: error.message };
        }
    }
 /////REMOVE FROM CART
    async function removeItemFromCart(email, shoeId) {
        try {
            let userId = await getUserId(email);
    
            // Remove item from cart
            await db.none('DELETE FROM shoes_cart WHERE user_id = $1 AND shoe_id = $2', [userId, shoeId]);
    
            return { success: true, message: 'Item removed from cart successfully' };
        } catch (error) {
            console.error('Error removing item from cart:', error);
            return { success: false, message: 'Error removing item from cart' };
        }
    }

////GET CART
    async function getUserCart(email) {
        let userId = await getUserId(email);
    //get the cart items
        const cartItems = await db.manyOrNone(
            'SELECT shoes.image_url AS imgurl, shoes_cart.quantity, shoes.price FROM shoes_cart JOIN shoes ON shoes_cart.shoe_id = shoes.id WHERE shoes_cart.user_id = $1',
            [userId]
        );
    
        // Calculate total price 
        let totalPrice = 0;
        for (const item of cartItems) {
            totalPrice += item.price * item.quantity;
        }
    
        return { cartItems, totalPrice };
    }
////// DELETE CART
    async function deleteCart(email){
        let userId = await getUserId(email)
        await db.none('DELETE FROM shoes_cart WHERE user_id = $1', [userId])
    }

////// CHECKOUT
    async function checkout(email) {
        try {
            // Get the user's cart
            const userCart = await getUserCart(email);
           
            //get cart items
            const shoesInCart = userCart.cartItems;
    
            // Get the total price
            let total = userCart.totalPrice;
    
            // Check if the user's balance is enough
            let userBalance = await getUserBalance(email);
            if (total > userBalance) {
                throw new Error('Insufficient funds');
            }
    
            // Remove items from the cart and stock
            for (const item of shoesInCart) {
                var imageURL = item.imgurl;
                var quant = item.quantity
                console.log(imageURL, quant)
                await removeShoe(imageURL,quant)
                await deleteCart(email)
            }
           
            // Deduct the total price from the user's balance
            let newBalance = userBalance - total;
            await updateUserBalance(email, newBalance);
    
            return { success: true, message: 'Checkout successful!' };
        } catch (error) {
            console.error('Error during checkout:', error);
            throw error;
        }
    }

    return {
        fetchAllShoes,
        fetchSoldOutShoes,
        fetchShoesByBrandAndSize,
        fetchShoesByBrand,
        fetchShoesBySize,
        fetchAllShoesWithColorCode,
        addShoe,
        getShoeId,
        removeShoe,
        deleteShoes,
        insertUser,
        getUserId,
        getUser,
        addToCart,
        getUserCart,
        deleteCart,
        getUserBalance,
        updateUserBalance,
        removeItemFromCart,
        checkout,
    }
}

export default shoeCatalogue
