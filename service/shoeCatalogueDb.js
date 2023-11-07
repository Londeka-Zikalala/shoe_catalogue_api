function shoeCatalogue(db){

async function fetchAllShoes(){
    const allShoes = await db.manyOrNone('SELECT * FROM shoes');
    
    return allShoes
}

async function fetchShoesByBrandAndSize(brandName, shoeSize){
    let shoes;
    if(brandName && shoeSize){
        shoes = await db.manyOrNone('SELECT * FROM shoes WHERE brand=$1 AND size=$2', [brandName,shoeSize])
    }
    else if(brandName || shoeSize ){
        if (brandName) {
            shoes = await db.manyOrNone('SELECT * FROM shoes WHERE brand=$1', [brandName]);
        } else {
            shoes = await db.manyOrNone('SELECT * FROM shoes WHERE size=$1', [shoeSize]);
        }
    }

    else {
        // return all shoes if both brandName and shoeSize are not provided
        shoes = await db.manyOrNone('SELECT * FROM shoes')
    }
    return shoes
}

async function fetchShoesByBrand(brandName){
    return await db.manyOrNone('SELECT * FROM shoes WHERE brand=$1', [brandName])
}

async function fetchShoesBySize(shoeSize){
    return await db.manyOrNone('SELECT * FROM shoes WHERE size=$1', [shoeSize])
}

async function addShoe(brandName, shoeSize, shoeColor, shoePrice, inStock, imageURL) {
    try {
        // Check if shoe exists
        const shoe = await db.oneOrNone('SELECT * FROM shoes WHERE color = $1 AND brand = $2 AND size = $3', [shoeColor, brandName, shoeSize]);

        // If shoe does not exist, insert new shoe
        if (!shoe) {
            await db.none('INSERT INTO shoes (color, brand, price, size, in_stock, image_url) VALUES ($1, $2, $3 , $4, $5, $6)', [shoeColor, brandName, shoePrice, shoeSize, inStock, imageURL]);
        } else {
            // Update in_stock for existing shoe
            const newInStock = shoe.in_stock + inStock;
            await db.none('UPDATE shoes SET in_stock = $1 WHERE color = $2 AND brand = $3 AND size = $4 AND image_url =$5', [newInStock, shoeColor, brandName, shoeSize, imageURL]);
        }
    } catch (error) {
        console.error(error.message);
        
    }
}


async function removeShoe(shoeId){
    //reduce 1 from the stock
    await db.none('UPDATE shoes SET in_stock = in_stock - 1 WHERE id = $1',[shoeId])
}


async function insertUser(username, email, password) {
    try {
        // Check if user already exists
        const user = await db.oneOrNone('SELECT * FROM users WHERE username = $1', [username]);

        // If user does not exist, insert new user
        if (!user) {
            await db.none('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);
        } else {
           //get the id
           await getUserId(email);
  
        }
    } catch (error) {
        console.error(error.message);
       
    }
}

async function getUserId(email){
    let userId = await db.oneOrNone('SELECT id FROM users WHERE email = $1', [email])
    let userID = userId.id
    console.log(userID)
    return userID
}

async function getShoeId(imageURL){
    let shoeId = await db.oneOrNone('SELECT id FROM shoes WHERE image_url = $1', [imageURL])
    let shoeID = shoeId.id;
    console.log(shoeID)
    return shoeID
}
async function addToCart(email, imageURL, quantity) {
    try {
       let userId = await getUserId(email)
       let shoeId = await getShoeId(imageURL)
        
        // A shoe that has been already already picked by the user 
        const alreadySelected = await db.oneOrNone('SELECT * FROM shoes_cart WHERE user_id = $1 AND shoe_id = $2', [userId, shoeId]);
// Check if the user already already picked the shoe and update cart or add a new shoe
        if (alreadySelected) {
            // Update quantity if item already exists in the cart
            await db.none('UPDATE shoes_cart SET quantity = quantity + $1 WHERE user_id = $2 AND shoe_id = $3', [quantity, userId, shoeId]);
        } else {
            // Add new item to the cart
            await db.none('INSERT INTO shoes_cart (user_id, shoe_id, quantity) VALUES ($1, $2, $3)', [userId, shoeId, quantity]);
        }

        return { success: true, message: 'Shoe added to cart successfully' }; 
    } catch (error) {
        console.error('Error adding to cart:', error);
        return { success: false, message: 'Error adding to cart' };
    }
}

async function getUserCart(email){
    let userId = await getUserId(email)
    return  await db.manyOrNone('SELECT shoes.image_url AS imgUrl, shoes_cart.quantity FROM shoes_cart JOIN shoes ON shoes_cart.shoe_id = shoes.id WHERE shoes_cart.user_id = $1', [userId]);
}

async function checkout(email) {
    try {
        let userId = await getUserId(email)
        // Get the shoes in the user's cart
        const selectedShoes = await db.any('SELECT * FROM shoes_cart WHERE user_id = $1', [userId]);

        let total = 0;

        // get each shoe
        for (const shoe of selectedShoes) {
            const { shoe_id: shoeId, quantity } = shoe;

            // Fetch the price of the item from the shoes table
            const cost = await db.one('SELECT price FROM shoes WHERE id = $1', [shoeId]);

            // Calculate the total price for this item
            const totalCost = cost.price * quantity;
            total += totalCost;

            // Remove the item from the cart
            await db.none('DELETE FROM shoes_cart WHERE user_id = $1 AND shoe_id = $2', [userId, shoeId]);
        }

        return { success: true, message: 'Checkout successful', total };
    } catch (error) {
        console.error('Error during checkout:', error);
        return { success: false, message: 'Error during checkout' };
    }
}

return{
    fetchAllShoes, 
    fetchShoesByBrandAndSize,
    fetchShoesByBrand,
    fetchShoesBySize,
    addShoe,
    getShoeId,
    removeShoe,
    insertUser,
    getUserId,
    addToCart,
    getUserCart,
    checkout,
}
}

export default shoeCatalogue