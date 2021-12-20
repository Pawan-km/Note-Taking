const jwt = require('jsonwebtoken');
const JWT_SECRET = 'FJDSLKAJFKLJASD'

const fetchuser = (req, res, next) => {

    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
    } catch (error) {
        
    }


    next()
}

module.exports = fetchuser;