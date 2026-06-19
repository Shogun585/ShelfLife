const express = require('express');
const { authMiddleware } = require('../utils/middleware');
const { user, household, item } = require('../utils/database');
const { determineStatus } = require('../utils/expiry');
const router = express.Router();

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
        const itemsList = await item.find({
            householdId : householdId,
            status : status,
            category : category
        });

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

        return res.status(200).json({
            message : "Item added successfully"
        });    
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error : err.message
        })
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
        const updatedItem = await item.findById(itemId).findOneAndUpdate({
            householdId : householdId,
            addedBy : userId
        }, {
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

    try{
        const updatedItem = await item.findById(itemId).findOneAndUpdate({
            householdId : householdId,
            addedBy : userId
        }, {
            status : status,
            updatedAt : new Date()
        });

        return res.status(200).json({
            message : `Item with id ${itemId} was successfully in house-id ${householdId} by user-id ${userId}`
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({
            error : err.message
        })
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
        const deleteItem = await item.findOneAndDelete({
            _id : itemId,
            householdId : householdId,
            addedBy: userId
        });

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