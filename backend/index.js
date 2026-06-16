require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT;
const app = express();

const authRouter = require('./routes/auth');
const householdRouter = require('./routes/household');
const dashboardRouter = require('./routes/dashboard');
const itemRouter = require('./routes/item');

app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
})