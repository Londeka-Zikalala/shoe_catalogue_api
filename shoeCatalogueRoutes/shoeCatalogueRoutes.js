function shoeCatalogueRoute(shoesdb){

    function showIndex(req, res, next){
        try{
            res.render('index')
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
return{
    showIndex,
    listAllShoes
}
}

export default shoeCatalogueRoute