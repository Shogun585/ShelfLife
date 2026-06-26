const { verifyAccessToken } = require("./token");

const {rateLimit} = require('express-rate-limit');

function authMiddleware(req, res, next){
    const authToken = req.headers.authorization;

    if(!authToken || !authToken.startsWith('Bearer')){
        return res.status(401).json({
            message : "The access token is invalid or has expired."
        });
    }

    try {
        const token = authToken.split(' ')[1];

        const decodedData = verifyAccessToken(token);

        if(!decodedData.success){
            return res.status(401).json({
                message : decodedData.data
            });
        }

        const payload = decodedData.data;

        const userId = payload.userId;

        req.userId = userId;

        next();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }finally{
        
    }
}

const globalLimiter = rateLimit({
    windowMs : 15 * 60 * 100,
    limit : 100,
    message : {
        message : "Too many requests from this IP, please try again after some time."
    },
    standardHeaders : true,
    legacyHeaders : false
});

const authLimiter = rateLimit({
    windowMs : 60 * 60 * 100,
    limit : 5,
    message : {
        message : "Too many requests from this IP, please try again after some time."
    },
    standardHeaders : true,
    legacyHeaders : true
});

module.exports = {
    authMiddleware,
    globalLimiter,
    authLimiter
}