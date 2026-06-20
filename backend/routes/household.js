const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { authMiddleware } = require('../utils/middleware');
const { user, household } = require('../utils/database');
const { generateReferralCode } = require('../utils/referral');

router.post('/', authMiddleware, async(req, res)=>{
    
    const userId = req.userId;

    const validUser = await user.findById(userId);  

    if(!validUser){
        return res.status(404).json({
            message : "Couldn't find the user!"
        });
    }

    const {name} = req.body;

    const inviteCode = generateReferralCode();

    const session = await mongoose.startSession()

    session.startTransaction()

    try{
        // create household
        const createHousehold = await household.insertOne({
            name : name,
            inviteCode : inviteCode,
            createdAt : new Date()
        });

        // update the members array of the created household
        await household.updateOne({
            inviteCode : inviteCode
        },{
            $push : {
                members : userId
            }
        });

        // update the user with new household id ??
        await user.findByIdAndUpdate(userId, {
            $set : {
                householdId : createHousehold._id
            }
        });

        return res.status(200).json({
            message : `Household created successfully.`
        });
    }catch(err){
        await session.abortTransaction()
        console.error(err);
        return res.status(500).json({
            error : err.message
        });
    }finally{
        session.endSession();
    }
});

router.post('/join', authMiddleware, async(req, res)=>{
    const userId = req.userId;

    const validUser = await user.findById(userId);  

    if(!validUser){
        return res.status(404).json({
            message : "Couldn't find the user!"
        });
    }
    
    const {inviteCode} = req.body;

    const validHousehold = await household.findOne({
        inviteCode : inviteCode
    });

    if(!validHousehold){
        return res.status(404).json({
            message : `Household with invite code ${inviteCode} not found.`
        });
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        const alreadyAMember = validHousehold.members;

        alreadyAMember.filter(id => id === userId);

        if(alreadyAMember.length !== 0){
            return res.status(409).json({
                message : "User is already a member of household."
            });
        }

        const newMember =  await user.findByIdAndUpdate(userId, {
            householdId : validHousehold._id
        });

        return res.status(200).json({
            message : `${newMember.name} is a member of ${validHousehold.name} house.`
        });
    } catch (err) {
        await session.abortTransaction();
        console.error(err);
        return res.status(500).json({
            error : err.message
        });
    }finally{
        await session.endSession();
    }
});

router.get('/me', authMiddleware, async(req, res)=>{
    const userId = req.userId;

    const userDetails = await user.findById(userId);

    if(!userDetails){
        return res.status(404).json({
            message : "Couldn't find the user!"
        });
    }

    return res.status(200).json({
        user_id : userId,
        user_name : userDetails.name,
        user_email : userDetails.email,
        household_id : userDetails.householdId
    });
});

router.get('/:id/members', authMiddleware, async(req, res) => {
    const userId = req.userId;

    const userDetails = await user.findById(userId);

    if(!userDetails){
        return res.status(404).json({
            message : "Couldn't find the user!"
        });
    }

    const householdId = req.params.id;

    try {
        const householdDetails = await household.findById(householdId);

        const members = await householdDetails.populate({
            path : 'members', 
            select : ['name', 'email', 'householdId']
        });

        const memberDetails = members.$getPopulatedDocs();

        return res.status(200).json({
            message : "Details fetched successfully!",
            household_members : memberDetails
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error : err.message
        });
    }
});

module.exports = router;