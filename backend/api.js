const express = require('express');
const router = express.Router();

const authRouter = require('./routes/auth');
const householdRouter = require('./routes/household');
const dashboardRouter = require('./routes/dashboard');
const itemRouter = require('./routes/item');

router.use((req, res, next) => {
  res.setHeader('X-Author', 'Abhilash Singh');
  res.setHeader('X-Project-Name', 'ShelfLife');
  next();
});


router.use('/auth', authRouter);
router.use('/households', householdRouter);
router.use('/items', itemRouter);
router.use('/dashboard', dashboardRouter);

module.exports = router;