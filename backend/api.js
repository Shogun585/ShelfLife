const express = require('express');
const router = express.Router();

const authRouter = require('./routes/auth');
const householdRouter = require('./routes/household');
const dashboardRouter = require('./routes/dashboard');
const itemRouter = require('./routes/item');

router.use('/auth', authRouter);
router.use('/households', householdRouter);
router.use('/items', itemRouter);
router.use('/dashboard', dashboardRouter);

module.exports = router;