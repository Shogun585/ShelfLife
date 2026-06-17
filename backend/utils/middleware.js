const { verifyAccessToken } = require("./token");

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

module.exports = {
    authMiddleware
}