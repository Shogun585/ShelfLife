const express = require('express');
const { authMiddleware } = require('../utils/middleware');
const { user, household, item } = require('../utils/database');
const { determineStatus } = require('../utils/expiry');
const mongoose = require('mongoose');
const router = express.Router();

async function updateHouseholdWasteScore(householdId, session = null) {
    const queryOptions = session ? { session } : {};
    
    const allItems = await item.find({ householdId }, null, queryOptions).select('status');

    const resolvedItems = allItems.filter(i => i.status === 'used' || i.status === 'wasted');
    
    let wasteScore = 0;
    if (resolvedItems.length > 0) {
        const wastedItems = resolvedItems.filter(i => i.status === 'wasted').length;
        const usedItems = resolvedItems.filter(i => i.status === 'used').length;
        wasteScore = Math.floor((wastedItems / (wastedItems + usedItems)) * 100);
    }

    return wasteScore;
}

router.get('/', authMiddleware, async (req, res)=>{
    const userId = req.userId;
    
    const userDetails = await user.findById(userId);

    if(!userDetails){
        return res.status(404).json({
            message : "Couldn't find the user!"
        });
    }

    const householdId = userDetails.householdId;

    const validHousehold = await household.findById(householdId);

    if(!validHousehold){
        return res.status(401).json({
            message : "Couldn't find valid household."
        });
    }
    
    const {status, category} = req.query;

    try {
        const query = {
            householdId : householdId
        };

        if(status){
            query.status = status;
        }else{
            query.status = {
                $nin : ['used', 'wasted']
            };
        }

        if(category){
            query.category = category;
        }

        const itemsList = await item.find(query).populate('addedBy', 'name');

        return res.status(200).json({
            message : "List of items fetched suuccessfully",
            list_of_items : itemsList
        });     
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error : err.message
        })
    }
});

router.post('/', authMiddleware, async(req, res)=>{
    const userId = req.userId;
    
    const userDetails = await user.findById(userId);

    if(!userDetails){
        return res.status(404).json({
            message : "Couldn't find the user!"
        });
    }

    const householdId = userDetails.householdId;

    const validHousehold = await household.findById(householdId);

    if(!validHousehold){
        return res.status(401).json({
            message : "Couldn't find valid household."
        });
    }

    const { name, category, expiryDate, quantity } = req.body;

    const session = await mongoose.startSession();

    session.startTransaction()

    try {
        const itemStatus = determineStatus(expiryDate);

        const addItem = await item.create({
            householdId : householdId,
            addedBy : userId,
            name : name,
            category : category,
            quantity : parseInt(quantity),
            expiryDate : expiryDate,
            status : itemStatus,
            createdAt : new Date(),
            updatedAt : new Date()
        });

        const updatedScore = await updateHouseholdWasteScore(householdId, session);

        validHousehold.set('wasteScore', updatedScore).save();

        return res.status(200).json({
            message : "Item added successfully"
        });    
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error : err.message
        });
        session.abortTransaction();
    }finally{
        session.endSession();
    }
});

router.put('/:id', authMiddleware, async (req, res)=>{
    const userId = req.userId;
    
    const userDetails = await user.findById(userId);

    if(!userDetails){
        return res.status(404).json({
            message : "Couldn't find the user!"
        });
    }

    const householdId = userDetails.householdId;

    const validHousehold = await household.findById(householdId);

    if(!validHousehold){
        return res.status(401).json({
            message : "Couldn't find valid household."
        });
    }

    const itemId = req.params.id;
    const {name, category, quantity, expiryDate} = req.body;

    const itemExists = await item.findById(itemId);

    if(!itemExists){
        return res.status(404).json({
            message : "Item does not exits."
        })
    }

    try {
        const updatedItem = await item.findByIdAndUpdate(itemId, {
            name : name,
            category : category,
            quantity : parseInt(quantity),
            expiryDate : expiryDate,
            updatedAt : new Date()
        });

        return res.status(200).json({
            message : `Item with id ${itemId} was successfully in house-id ${householdId} by user-id ${userId}`
        });    
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error : err.message
        })
    }
});

router.patch('/:id/:status', authMiddleware, async(req, res)=>{
    const userId = req.userId;
    
    const userDetails = await user.findById(userId);

    if(!userDetails){
        return res.status(404).json({
            message : "Couldn't find the user!"
        });
    }

    const householdId = userDetails.householdId;

    const validHousehold = await household.findById(householdId);

    if(!validHousehold){
        return res.status(401).json({
            message : "Couldn't find valid household."
        });
    }

    const itemId = req.params.id;
    const status = req.params.status;

    const itemExists = await item.findById(itemId);

    if(!itemExists){
        return res.status(404).json({
            message : "Item does not exits."
        })
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try{
        const updatedItem = await item.findByIdAndUpdate(itemId, {
            status : status,
            updatedAt : new Date()
        });

        const updatedScore = await updateHouseholdWasteScore(householdId, session);

        validHousehold.set('wasteScore', updatedScore).save();

        return res.status(200).json({
            message : `Item with id ${itemId} was successfully in house-id ${householdId} by user-id ${userId}`
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            error : err.message
        });
        session.abortTransaction();
    }finally{
        session.endSession();
    }
});

router.delete('/:id', authMiddleware, async(req, res)=>{
    const userId = req.userId;
    
    const userDetails = await user.findById(userId);

    if(!userDetails){
        return res.status(404).json({
            message : "Couldn't find the user!"
        });
    }

    const householdId = userDetails.householdId;

    const validHousehold = await household.findById(householdId);

    if(!validHousehold){
        return res.status(401).json({
            message : "Couldn't find valid household."
        });
    }

    const itemId = req.params.id;

    const itemExists = await item.findById(itemId);

    if(!itemExists){
        return res.status(404).json({
            message : "Item does not exits."
        })
    }

    try {
        const deleteItem = await item.findByIdAndDelete(itemId);


        return res.status(200).json({
            message : "Item deleted successfully."
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error : err.message
        })
    }
});

module.exports = router;