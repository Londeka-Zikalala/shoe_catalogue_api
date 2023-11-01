function shoesAPI(shoesdb){
	
        async function allShoes(req, res) {
            try {
                let allInStore = await shoesdb.fetchAllShoes();
                res.json({
                    status: 'success',
                    data: allInStore
                });
            }
            catch (error) {
                res.json({
                    status: "error",
                    error: error.stack
                });
            }
        };
    
        async function addShoes(req, res) {
            try {
                const brandName = req.body.brand;
                const shoeSize = req.body.size;
                const shoeColor = req.body.color;
                const shoePrice= req.body.price;
                const inStock = req.body.in_stock;
                const imageURL = req.body.image_url
    
                await shoesdb.addShoe(brandName,shoeSize,shoeColor,shoePrice,inStock,imageURL);
    
                let allInStore = await shoesdb.fetchAllShoes();
                res.json({
                    status: 'success',
                    data: allInStore
                });
            }
            catch (error) {
                res.json({
                    status: "error",
                    error: error.stack
                });
            }
        };

        async function deleteShoe (req,res) {
            try{
                const shoeId = req.params.id
                await shoesdb.removeShoe(shoeId)
                res.json({
                    status: 'success',
                });
            } catch (error) {
                res.json({
                    status: "error",
                    error: error.stack
                });
            }
        };
    
        async function getShoesBySizeAndBrand(req, res) {
            try {
                let brandName = req.params.brand;
                let shoeSize = req.params.size;
                
                let allInStore = await shoesdb.fetchShoesByBrandAndSize(brandName, shoeSize);
                
                res.json({
                    status: 'success',
                    data: allInStore
                });
            }
            catch (error) {
                res.json({
                    status: "error",
                    error: error.stack
                });
            }
        };
        async function getShoesByBrand(req, res) {
            try {
                let brandName = req.params.brand;
                
                let allInStore = await shoesdb.fetchShoesByBrand(brandName);
                
                res.json({
                    status: 'success',
                    data: allInStore
                });
            }
            catch (error) {
                res.json({
                    status: "error",
                    error: error.stack
                });
            }
        };
        async function getShoesBySize(req, res) {
            try {
             
                let shoeSize = req.params.size;
                
                let allInStore = await shoesdb.fetchShoesBySize(shoeSize);
                
                res.json({
                    status: 'success',
                    data: allInStore
                });
            }
            catch (error) {
                res.json({
                    status: "error",
                    error: error.stack
                });
            }
        };

        async function addToCart(req, res) {
            try {
                const userId = req.body.userId;
                const shoeId = req.body.shoeId;
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
        const userId = req.params.userId;
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
            allShoes,
            addShoes,
            deleteShoe,
            getShoesBySizeAndBrand,
            getShoesByBrand,
            getShoesBySize,
            addToCart,
            getCart,
            checkout
        }
    }
    
export default shoesAPI