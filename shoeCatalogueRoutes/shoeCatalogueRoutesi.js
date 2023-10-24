function shoeCatalogueRoute(shoesdb){

    async function showIndex(req, res, next){
        try{
            const allInStore = await shoesdb.fetchAllShoes()
            
            res.render('index', {
                allInStore
            })
        }catch(error){
            console.error('Failure to fetch index')
            next(error)
        }
     
        
        
    }
async function listAllShoes(req, res, next){
    try{
        const allInStore = await shoesdb.fetchAllShoes()
       
        res.render('index',{
            allInStore
        })
    }
  catch(error){
    console.error('Failure fetching all shoes')
    next(error)
  }
   

}

async function listShoesByBrandAndSize(req, res,next){
    let brandName;
    let shoeSize;
    try{
        brandName = req.query.brand;
        shoeSize = req.query.size;
        
            const allInStore = await shoesdb.fetchShoesByBrandAndSize(brandName,shoeSize)
        
        
        res.render('index', {
            brandName,
            shoeSize,
            allInStore
        })

    }catch(error){
        console.error(`Failure fetching ${brandName} size:${shoeSize} shoes.`)
        next(error)
    }
}

async function showStockUpdate(req, res, next){
    res.render('stock-update')
}

async function addAShoe(req, res,next){
    try{
        const brandName = req.body.brand;
        const shoeSize = req.body.size;
        const shoeColor = req.body.color;
        const shoePrice= req.body.price;
        const inStock = req.body.in_stock;
console.log(shoeColor)
console.log(brandName)
        await shoesdb.addShoe(brandName,shoeSize,shoeColor,shoePrice,inStock);

        res.redirect('/stock-update/api/shoes')
    }
    catch(error){
        console.error(error.message);
        next(error);
    }
    
}
return{
    showIndex,
    listAllShoes,
    listShoesByBrandAndSize,
    showStockUpdate,
    addAShoe,
}
}

export default shoeCatalogueRoute