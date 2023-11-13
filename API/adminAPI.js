function adminAPI(shoesdb){
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

    async function deleteInStock (req,res) {
        try{
            const shoeId = req.body.id;
            const shoeQuantity = req.body.quantity;
            await shoesdb.removeShoe(shoeId, shoeQuantity)
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

    async function removeEntireStock (req, res){
        try{
            const shoeId = req.params.id
            await shoesdb.deleteShoes(shoeId)
            res.json({
                status: 'success',
            });
        } catch (error) {
            res.json({
                status: "error",
                error: error.stack
            });
        }
    }
    async function getOutOfStockShoes (req,res){
        try{
            const soldOut = await shoesdb.fethSoldOutShoes()
            res.json({
                status: 'success',
                data: soldOut
            });
        } catch (error) {
            res.json({
                status: "error",
                error: error.stack
            });
        }
    }

    return{
        addShoes,
        deleteInStock,
        removeEntireStock,
        getOutOfStockShoes,

    }
}

export default adminAPI;