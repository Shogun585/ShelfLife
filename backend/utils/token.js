require('dotenv').config();
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;
const ACCESS_TIME = '15m';

const createAccessToken = (data) => {
    const accessToken = jwt.sign(data, SECRET_KEY, {
        expiresIn : ACCESS_TIME
    });

    return accessToken;
}

const verifyAccessToken = (token) => {
    try{
        const decoded = jwt.verify(token, SECRET_KEY);

        return {
            success : true,
            data : decoded
        };
    }catch(err){
        console.error("Unauthorized");
        return {
            success : false,
            data : err
        };
    }
}

module.exports = {
    createAccessToken,
    verifyAccessToken
};