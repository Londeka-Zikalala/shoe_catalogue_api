function shoeCatalogueRoute(shoesdb){

    async function showIndex(req, res, next){
        try{
            const allInStore = await shoesdb.fetchAllShoes()
            
            res.render('index', {
                allInStore,
                messages: req.flash()
            })
        }catch(error){
            console.error('Failure to fetch index')
            next(error)
        }
     
        
        
    };

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

};

async function listShoesByBrandAndSize(req, res,next){
    let brandName;
    let shoeSize;
    try{
        brandName = req.query.brand;
        shoeSize = req.query.size;
        

            let allInStore = await shoesdb.fetchAllShoes();
    
            if (brandName || shoeSize) {
                allInStore = await shoesdb.fetchShoesByBrandAndSize(brandName, shoeSize);
            }
    
            if (allInStore.length === 0) {
                req.flash('info', `No ${brandName} shoes of size ${shoeSize} in stock.`)
            }

        res.render('index', {
            brandName,
            shoeSize,
            allInStore
        })

    }catch(error){
        console.error(`Failure fetching ${brandName} size:${shoeSize} shoes.`)
        req.flash('error', `Failed to fetch ${brandName} size:${shoeSize} shoes.`);
        next(error);
    }
};


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
        const imageURL = req.body.image_url

        await shoesdb.addShoe(brandName,shoeSize,shoeColor,shoePrice,inStock,imageURL);

        req.flash('success', 'Shoe added successfully');
        res.redirect('/stock-update/shoes')
    }
    catch(error){
        console.error(error.message);
        req.flash('error', 'Failed to add shoe');
        next(error);
    }
    
};

async function removeAShoe(req, res,next){
    try{
        const shoeId = req.body.id;
        console.log(shoeId)
        await shoesdb.removeShoe(shoeId)

        req.flash('success', 'Shoe removed successfully');
        res.redirect('/stock-update/shoes')
    }
    catch(error){
        console.error(error.message);
        req.flash('error', 'Failed to remove shoe');
        next(error);
    }
};



return{
    showIndex,
    listAllShoes,
    listShoesByBrandAndSize,
    showStockUpdate,
    addAShoe,
    removeAShoe,
}
};

export default shoeCatalogueRoute