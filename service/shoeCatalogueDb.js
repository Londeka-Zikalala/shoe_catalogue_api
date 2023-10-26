function shoeCatalogue(db){
async function fetchAllShoes(){
    const allShoes = await db.manyOrNone('SELECT * FROM shoes');
    
    return allShoes
}

async function fetchShoesByBrandAndSize(brandName, shoeSize){
    let shoes;
    if(brandName && shoeSize){
        shoes = await db.any('SELECT * FROM shoes WHERE brand=$1 AND size=$2', [brandName,shoeSize])
    }
    else if(brandName){
        shoes = await db.any('SELECT * FROM shoes WHERE brand=$1', [brandName])
    }
    else if(shoeSize){
        shoes = await db.any('SELECT * FROM shoes WHERE size=$1', [shoeSize])
    }
    else {
        // return all shoes if both brandName and shoeSize are not provided
        shoes = await db.any('SELECT * FROM shoes')
    }
    return shoes
}


async function addShoe(brandName, shoeSize, shoeColor,shoePrice, inStock,imageURL){
   

    await db.none('INSERT INTO shoes (color, brand, price, size, in_stock,image_url) VALUES ($1, $2, $3 , $4, $5,$6)', [shoeColor, brandName, shoePrice, shoeSize,inStock,imageURL])
}

async function removeShoe(shoeId){
    await db.none('UPDATE shoes SET in_stock = in_stock - 1 WHERE id = $1',[shoeId])
}

return{
    fetchAllShoes, 
    fetchShoesByBrandAndSize,
    addShoe,
    removeShoe,
}
}

export default shoeCatalogue