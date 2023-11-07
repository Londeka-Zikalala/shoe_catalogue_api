function userAPI(shoesdb){
    async function registerUser(req, res) {
        try {
            const { username, email, password } = req.body;
            await shoesdb.insertUser(username, email, password);
            res.json({ status: 'success', message: 'User registered successfully' });
        } catch (error) {
            res.json({ status: 'error', error: error.stack });
        }
    }
    async function addToCart(req, res) {
        try {
            const userId = req.body.email;
            const shoeId = req.body.image_url;
            const quantity = req.body.quantity;

            const addToCartResult = await shoesdb.addToCart(userId, shoeId, quantity);

            res.json(addToCartResult);
        } catch (error) {
            res.json({
                status: "error",
                error: error.stack
            });
        }
    };
    
async function getCart(req, res) {
try {
    const userId = req.params.email;
    const cart = await shoesdb.getUserCart(userId); 
    res.json({
        status: 'success',
        cart
    });
} catch (error) {
    res.json({
        status: "error",
        error: error.stack
    });
}
};

       
async function checkout(req, res) {
    try {
        const userId = req.params.userId; 

        const checkoutResult = await shoeCatalogue.checkout(userId);
        res.json(checkoutResult);
    } catch (error) {
        res.json({
            status: "error",
            error: error.stack
        });
    }
};
return{
    registerUser,
    addToCart,
    getCart,
    checkout
}
}

export default userAPI