require('dotenv').config();
const express = require('express');
const { user, household } = require('../utils/database');
const hashing = require('../utils/hashing');
const NODE_ENV = process.env.NODE_ENV;
const router = express.Router();


router.post('/reset-db', async (req, res)=>{
    if(NODE_ENV !== 'test'){
        return res.status(403).json({
            error : "Cannot reset db while in production"
        });
    }

    try {
        await user.deleteMany({});
        await household.deleteMany({});

        const hashedPassword = await hashing.createHashedPassword('123456');
        await user.create({
            email : 'robot@gmail.com',
            password : hashedPassword,
            name : 'Test robot'
        });

        res.status(200).json({
            message : "Test database reset and seeded successfully."
        });


    } catch (error) {
        res.status(500).json({ error: "Failed to reset test DB" });
    }
});

module.exports = router;