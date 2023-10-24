function shoeCatalogue(db){
async function fetchAllShoes(){
    const allShoes = await db.manyOrNone('SELECT * FROM shoes');
    
    return allShoes
}
async function fetchShoesBySize(shoeSize){
    const shoesBySize = await db.any('SELECT * FROM shoes WHERE size=$1', [shoeSize]);
    return shoesBySize

}

async function fetchShoesByBrand(brandName){
    const shoesByBrand = await db.any('SELECT * FROM shoes WHERE brand=$1', [brandName]);
    return shoesByBrand
}

async function fetchShoesByBrandAndSize(brandName, shoeSize){
    const shoesByBrandAndSize = await db.any('SELECT * FROM shoes WHERE brand=$1 AND size=$2',[brandName,shoeSize])
    return shoesByBrandAndSize
}

return{
    fetchAllShoes, 
    fetchShoesBySize,
    fetchShoesByBrand,
    fetchShoesByBrandAndSize,
}
}

export default shoeCatalogue