function shoeCatalogue(db){
async function fetchAllShoes(){
    const allShoes = await db.manyOrNone('SELECT * FROM shoes');
    
    return allShoes
}


async function fetchShoesByBrandAndSize(brandName, shoeSize){
    let shoes;
    if(brandName === "" ){
        shoes = await db.any('SELECT * FROM shoes WHERE size=$1', [shoeSize])
    }
    else if(shoeSize === "" ){
        shoes =await db.any('SELECT * FROM shoes WHERE brand=$1', [brandName])
    }
    else if (brandName && shoeSize){
        shoes = await db.any('SELECT * FROM shoes WHERE brand=$1 AND size=$2', [brandName,shoeSize])
    }
   
    return shoes
}

async function addShoe(brandName, shoeSize, shoeColor,shoePrice, inStock){
   
    await db.none('INSERT INTO shoes (color, brand, price, size, in_stock) VALUES ($1, $2, $3 , $4, $5)', [shoeColor, brandName, shoePrice, shoeSize,inStock])
}



return{
    fetchAllShoes, 
    // fetchShoesBySize,
    // fetchShoesByBrand,
    fetchShoesByBrandAndSize,
    addShoe,
}
}

export default shoeCatalogue