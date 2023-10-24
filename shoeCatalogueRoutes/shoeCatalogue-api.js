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
async function listShoesBySize(req, res,next){
    try{
        const shoeSize = req.query.size;
        const allInStore = await shoesdb.fetchShoesBySize(shoeSize);
        console.log(shoeSize,allInStore)
        res.render('index', {
            shoeSize,
            allInStore
        })
    } catch(error){
    console.error(`Failure fetching size: ${{shoeSize}} shoes.`)
    next(error)
  }
}

async function listShoesByBrand(req, res, next){
    try{
        const brandName = req.query.brand;
        const allInStore = await shoesdb.fetchShoesByBrand(brandName);
        res.render('index', {
            brandName,
            allInStore
        })
    }
    catch(error){
        console.error(`Failure fetching ${{brandName}} shoes.`)
        next(error)
}
}
async function listShoesByBrandAndSize(req, res,next){
    try{
        const brandName = req.query.brand;
        const shoeSize = req.query.size;
        const allInStore = await shoesdb.fetchShoesByBrandAndSize(brandName,shoeSize);
        res.render('index', {
            brandName,
            shoeSize,
            allInStore
        })

    }catch(error){
        console.error(`Failure fetching ${{brandName}} size:${{shoeSize}} shoes.`)
        next(error)
}
    
}
return{
    showIndex,
    listAllShoes,
    listShoesBySize,
    listShoesByBrand,
    listShoesByBrandAndSize,
}
}

export default shoeCatalogueRoute