const express = require('express');
const router = express.Router();

const hash = require('../utils/hashing');
const { user } = require('../utils/database');
const { createAccessToken } = require('../utils/token');

router.post('/register', async(req, res)=>{
    const {name, email, password, householdId} = req.body;

    const existingUser = await user.findOne({
        email : email
    });

    if(existingUser){
        return res.status(409).json({
            message : "User already exists!"
        });
    }

    try {
        const newUser = await user.create({
            name : name,
            email : email,
            password : await hash.createHashedPassword(password),
            householdId : householdId || null,
            createdAt : new Date()
        } );

        const data = {
            userId : newUser._id
        }

        const token = createAccessToken(data);

        return res.status(200).json({
            token : `Bearer ${token}`,
            user : {
                userId : newUser._id,
                name : newUser.name,
                email : newUser.email,
                householdId : newUser.householdId
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error : err.message
        });
    }
});

router.post('/login', async(req, res)=>{
    const {email, password} = req.body;

    const userExists = await user.findOne({
        email : email
    });

    if(!userExists){
        return res.status(404).json({
            message : "user not found!"
        });
    }

    const queriedHashedPassword = userExists.password;

    const isValid = await hash.verifyHashedPassword(queriedHashedPassword, password);

    if(!isValid){
        return res.status(401).json({
            message : "Inavlid email or password"
        });
    }

    try {
        const data = {
            userId : userExists._id
        }

        const token = createAccessToken(data);

        return res.status(200).json({
            token : `Bearer ${token}`,
            user : {
                userId : userExists._id,
                name : userExists.name,
                email : userExists.email,
                householdId : userExists.householdId
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error : err.message
        });
    }
});

module.exports = router;