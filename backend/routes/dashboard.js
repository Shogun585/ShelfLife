const express = require('express');
const { authMiddleware } = require('../utils/middleware');
const { user, household, item } = require('../utils/database');
const router = express.Router();

router.get('/stats', authMiddleware, async(req, res)=>{
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

    try {
        const itemsListByStatus = await item.find({
            addedBy : userId,
            householdId : householdId
        }).select(['_id', 'status']);

        const itemListByScore = await household.findById(householdId).select(['wasteScore']);

        const freshItems = itemsListByStatus.filter(item => item.status === 'fresh').length;

        const expiringItems = itemsListByStatus.filter(item => item.status === 'expiring-soon').length;

        const expiredItems = itemsListByStatus.filter(item => item.status === 'expired').length;

        const totalItems = itemsListByStatus.length;

        const usedItems = itemsListByStatus.filter(item => item.status === 'used').length;

        const wasteScore = Math.floor((usedItems/totalItems) * 100);

        return res.status(200).json({
            waste_score : `Waste score for house ${householdId} : ${wasteScore}`,
            fresh_items_count : freshItems,
            expiring_soon_items_count : expiringItems,
            expired_items_count : expiredItems,
        });    
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error : err.message
        });
    }
});

router.get('/expiring', authMiddleware, async(req, res)=>{
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

    try {
        const itemsListByStatus = await item.find({
            addedBy : userId,
            householdId : householdId
        }).select(['_id', 'status', 'expiryDate']);

        const expiringItems = itemsListByStatus.filter(item => item.status === 'expiring-soon');

        const today = new Date();

        const expiringInLt24 = expiringItems.filter(item => {    
            const expiry = new Date(item.expiryDate);

            const expHours = Math.floor((expiry - today)/(1000*60*60));

            if(expHours <= 24){
                return item;
            }
        })

        return res.status(200).json({
            items : expiringInLt24
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error : err.message
        });
    }
});

module.exports = router;