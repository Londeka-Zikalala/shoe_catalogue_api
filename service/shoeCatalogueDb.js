function shoeCatalogue(db){
async function fetchAllShoes(){
    const allShoes = await db.manyOrNone('SELECT * FROM shoes_catalogue.shoes');
    return allShoes
}
return{
    fetchAllShoes
}
}

export default shoeCatalogue