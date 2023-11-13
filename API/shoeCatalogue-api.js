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
                
                let allInStore = await shoesdb.fetchShoesBSize(shoeSize);
                
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
            getShoesBySizeAndBrand,
            getShoesByBrand,
            getShoesBySize,
           
        }
    }
    
export default shoesAPI