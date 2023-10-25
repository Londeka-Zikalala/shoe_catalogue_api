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
                const shoeId = req.body.id
                await shoesdb.deleteShoe(shoeId)
                res.json({
                    status: 'success',
                    data: allInStore
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
                let brandName = req.query.brand;
                let shoeSize = req.query.size;
                
                let allInStore = await shoesdb.fetchShoesByBrandAndSize(brandName,shoeSize);
                
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
    
        return{
            allShoes,
            addShoes,
            deleteShoe,
            getShoesBySizeAndBrand,
        }
    }
    
export default shoesAPI