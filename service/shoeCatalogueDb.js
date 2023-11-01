function shoeCatalogue(db){
async function fetchAllShoes(){
    const allShoes = await db.manyOrNone('SELECT * FROM shoes');
    
    return allShoes
}

async function fetchShoesByBrandAndSize(brandName, shoeSize){
    let shoes;
    if(brandName && shoeSize){
        shoes = await db.any('SELECT * FROM shoes WHERE brand=$1 AND size=$2', [brandName,shoeSize])
    }
    else if(brandName && shoeSize === null){
        shoes = await db.any('SELECT * FROM shoes WHERE brand=$1', [brandName])
    }
    else if(shoeSize && brandName === null){
        shoes = await db.any('SELECT * FROM shoes WHERE size=$1', [shoeSize])
    }
    else {
        // return all shoes if both brandName and shoeSize are not provided
        shoes = await db.any('SELECT * FROM shoes')
    }
    return shoes
}

async function fetchShoesByBrand(brandName){
    return await db.any('SELECT * FROM shoes WHERE brand=$1', [brandName])
}

async function fetchShoesBySize(shoeSize){
    return await db.any('SELECT * FROM shoes WHERE size=$1', [shoeSize])
}

async function addShoe(brandName, shoeSize, shoeColor,shoePrice, inStock,imageURL){
   //insert a new shoe
    await db.none('INSERT INTO shoes (color, brand, price, size, in_stock,image_url) VALUES ($1, $2, $3 , $4, $5,$6)', [shoeColor, brandName, shoePrice, shoeSize,inStock,imageURL])
}

async function removeShoe(shoeId){
    //reduce 1 from the stock
    await db.none('UPDATE shoes SET in_stock = in_stock - 1 WHERE id = $1',[shoeId])
}

async function addToCart(userId, shoeId, quantity) {
    try {
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

async function getUserCart(userId){
    return  await db.oneOrNone('SELECT * FROM shoes_cart WHERE user_id = $1 AND shoe_id = $2', [userId]);
}

async function checkout(userId) {
    try {
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
    removeShoe,
    addToCart,
    getUserCart,
    checkout,
}
}

export default shoeCatalogue