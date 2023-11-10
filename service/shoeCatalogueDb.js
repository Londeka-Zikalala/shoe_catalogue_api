function shoeCatalogue(db) {

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

    async function addShoe(brandName, shoeSize, shoeColor, shoePrice, inStock, imageURL) {
        try {
            // Check if shoe exists
            const shoe = await db.oneOrNone('SELECT id FROM shoes WHERE color = $1 AND brand = $2 AND size = $3', [shoeColor, brandName, shoeSize]);

            // If shoe does not exist, insert new shoe
            if (!shoe) {
                await db.none('INSERT INTO shoes (brand, size, color, price, in_stock, image_url) VALUES ($1, $2, $3 , $4, $5, $6)', [brandName, shoeSize, shoeColor, shoePrice, inStock, imageURL]);
            } else {
                // Update in_stock for existing shoe
                const newInStock = shoe.in_stock + inStock;
                await db.none('UPDATE shoes SET in_stock = $1 WHERE color = $2 AND brand = $3 AND size = $4 AND image_url =$5', [newInStock, shoeColor, brandName, shoeSize, imageURL]);
            }
        } catch (error) {
            console.error(error.message);

        }
    }



    async function removeShoe(shoeId, quantity) {
        try {
            let stockAvailable = await db.one('SELECT in_stock FROM shoes WHERE id = $1', [shoeId]);
            
            if (stockAvailable > 0) {
                // Reduce the stock by the specified quantity
                await db.none('UPDATE shoes SET in_stock = in_stock - $1 WHERE id = $2', [quantity, shoeId]);
            }



        } catch (error) {
            console.error(error.message);

        }
    }
    async function insertUser(username, email, password, balance) {
        try {
            // Check if user already exists
            const user = await db.oneOrNone('SELECT id FROM users WHERE email = $1', [email]);
    
            // If user does not exist, insert new user
            if (!user) {
                await db.none('INSERT INTO users (username, email, password, balance) VALUES ($1, $2, $3, $4)', [username, email, password, balance]);
            } else {
                // Update the balance for an existing user
                return await getUserId(email)
            }
        } catch (error) {
            console.error(error.message);
        }
    }
    
    

    async function getUserId(email) {
        let userId = await db.oneOrNone('SELECT id FROM users WHERE email = $1', [email])
        let userID = userId.id
        console.log(userID)
        return userID
    }

    async function getShoeId(imageURL) {
        let shoeId = await db.oneOrNone('SELECT id FROM shoes WHERE image_url = $1', [imageURL])
        let shoeID = shoeId.id;
        console.log(shoeID)
        return shoeID
    }
    async function addToCart(email, imageURL, quantity) {
        try {
            let userId = await getUserId(email)
            let shoeId = await getShoeId(imageURL)
    
            // Check if the user already picked the shoe
            const alreadySelected = await db.oneOrNone('SELECT * FROM shoes_cart WHERE user_id = $1 AND shoe_id = $2', [userId, shoeId]);
            if (alreadySelected) {
                // Update quantity if item already exists in the cart
                await db.none('UPDATE shoes_cart SET quantity = $1 WHERE user_id = $2 AND shoe_id = $3', [quantity, userId, shoeId]);
            } else {
                // Add new item to the cart
                await db.none('INSERT INTO shoes_cart (user_id, shoe_id, quantity) VALUES ($1, $2, $3,$4)', [userId, shoeId, quantity]);
            }
    
            return { success: true, message: 'Cart updated successfully' };
        } catch (error) {
            console.error('Error updating cart:', error);
            return { success: false, message: 'Error updating cart' };
        }
    }
    
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

    async function getUserBalance(email) {
        try {
            const user = await db.one('SELECT balance FROM users WHERE email = $1', [email]);
            let userBalance = user.balance
            return userBalance
        } catch (error) {
            throw new Error('Error fetching user balance');
        }
    }
    
    async function updateUserBalance(email, newBalance) {
        try {
            await db.none('UPDATE users SET balance = $1 WHERE email = $2', [newBalance, email]);
        } catch (error) {
            throw new Error('Error updating user balance');
        }
    }

    async function getUserCart(email) {
        let userId = await getUserId(email);
    //get the cart items
        const cartItems = await db.manyOrNone(
            'SELECT shoes.image_url AS imgUrl, shoes_cart.quantity, shoes.price FROM shoes_cart JOIN shoes ON shoes_cart.shoe_id = shoes.id WHERE shoes_cart.user_id = $1',
            [userId]
        );
    
        // Calculate total price 
        let totalPrice = 0;
        for (const item of cartItems) {
            totalPrice += item.price * item.quantity;
        }
    
        return { cartItems, totalPrice };
    }

    async function checkout(email) {
        try {
            // Get the user's cart 
            const userCart = await getUserCart(email);
            const shoesInCart = userCart.cartItems;
            // Get the total price
            let total = userCart.totalPrice
            
    
            // Check if the user's balance is enough
            let userBalance = await getUserBalance(email);
            if (total > userBalance) {
                throw new Error('Insufficient funds');
            }
    
            // Remove items from the cart
            for (const item of shoesInCart) {
                await removeItemFromCart(email, item.shoe_id);
            }
    
            // Deduct total price from user's balance
            let newBalance = userBalance - total;
            await updateUserBalance(email, newBalance);
    
            return { success: true, message: 'Checkout successful!' };
        } catch (error) {
            console.error('Error during checkout:', error);
            return { success: false, message: 'Error during checkout' };
        }
    }

    return {
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
        getUserBalance,
        updateUserBalance,
        removeItemFromCart,
        checkout,
    }
}

export default shoeCatalogue