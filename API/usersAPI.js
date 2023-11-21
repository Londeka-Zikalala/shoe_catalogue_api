import bcrypt from 'bcrypt';
const saltRounds = 10;
function userAPI(shoesdb){

    /************USER ENDPOINTS, LOGIN, SIGNUP AND LOGOUT********** */
    async function registerUser(req, res) {
        try {
            const { username, email, password, balance } = req.body;
           
            // Regex for validating an email address
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

        // Regex for validating a username (only letters and numbers)
        const usernameRegex = /^[a-zA-Z0-9]+$/;

        if (!emailRegex.test(email)) {
            return res.json({ status: 'error', message: 'Invalid email format' });
        }

        if (!usernameRegex.test(username)) {
            return res.json({ status: 'error', message: 'Username must only contain letters and numbers' });
        }
        ///Check if the username or password are already taken
        const user = await shoesdb.getUser(email)
        for (var i = 0; i<user.length; i++){
            var fetchedUser = user[i]
        if(fetchedUser && username === fetchedUser.username){
            return res.json({ status: 'error', message: 'Username taken' });
        } else if(fetchedUser && email === fetchedUser.email ){
            return res.json({ status: 'error', message: 'Email already registered' })
        }
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
        await shoesdb.insertUser(username, email, hashedPassword, balance);
        res.json({ status: 'success', message: 'User registered successfully' });

        } catch (error) {
            res.json({ status: 'error', error: error.stack });
        }
    }

    async function loginUser(req, res){
        try{
            const email = req.body.email; 
            const password = req.body.password;
            const user = await shoesdb.getUser(email)
            for (var i = 0; i<user.length; i++){
                var fetchedUser = user[i]
                const match = await bcrypt.compare(password, fetchedUser.password);
            
            if(match && email === fetchedUser.email)
                {
                    req.session.userId = fetchedUser.id;
                    res.json({
                        status: 'success',
                        message:'User Logged In Succesfully!'
                    })
                }
            }
            res.json({
                status:'error',
                message: 'Invalid Email Or Password'
            })
         
        }catch(error){
            res.json({ status: 'error', error: error.stack });
        }
    };

    async function userLogout(req, res){
        try{
            req.session.destroy(err =>{
                if(err){
                    return res.json({
                        status: 'error',
                        message: 'Failed To Logout User'
                    })
                }
                res.clearCookie('connect.sid');
                res.json({
                    status: 'success',
                    message: 'Logout Successful!'
                })
            })
        }catch(error){
            res.json({ status: 'error', error: error.stack });
        }
    };

    async function userRole(req, res){
       try{
        let authenticatedUser = await registerUser(req, res);
        let userType;
        if(authenticatedUser){
            if(authenticatedUser.username.includes('Admin')){
                userType = 'admin'
            }
            else {
                userType = 'user'
            }

            return userType
        }
        res.json({ 
            status: 'success',
            data: userType })

       }catch(error){
            res.json({ status: 'error', error: error.stack });
        }
        
    }
    async function fetchUserBalance(req, res){
        try {
            const userId = req.params.email;
    
            const userBalance = await shoesdb.getUserBalance(userId);
            res.json({
                status:'success',
                data: userBalance
            });
        } catch (error) {
            res.json({
                status: "error",
                error: error.stack
            });
        }
    }

    /*********CART AND CHECKOUT******* */
    async function addToCart(req, res) {
        try {
            const userId = req.body.email;
            const shoeId = req.body.image_url;
            const quantity = req.body.quantity;
            const addToCartResult = await shoesdb.addToCart(userId, shoeId, quantity);

            res.json(addToCartResult);
        } catch (error) {
            res.json({
                status: "error",
                error: error.stack
            });
        }
    };
    
async function getCart(req, res) {
try {
    const userId = req.params.email;
    const cart = await shoesdb.getUserCart(userId); 
    res.json({
        status: 'success',
        cart
    });
} catch (error) {
    res.json({
        status: "error",
        error: error.stack
    });
}
};
       
async function checkout(req, res) {
    try {
        const userId = req.params.email; 

        const checkoutResult = await shoesdb.checkout(userId);
        res.json(checkoutResult);
    } catch (error) {
        res.json({
            status: "error",
            error: error.stack
        });
    }
};

return{
    registerUser,
    loginUser,
    userLogout,
    userRole,
    addToCart,
    getCart,
    fetchUserBalance,
    checkout
}
}

export default userAPI
