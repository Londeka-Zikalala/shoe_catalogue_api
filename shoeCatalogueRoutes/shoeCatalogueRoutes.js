function shoeCatalogueRoute(shoesRoute){
    function showIndex(req, res, next){
        res.render('index')
        next()
        
    }
async function listAllShoes(req, res, next){
   const allInStore = await shoesRoute.listAllShoes()
    res.render('index',{
        allInStore
    })
    next()

}
return{
    showIndex,
    listAllShoes
}
}

export default shoeCatalogueRoute