require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT;
const app = express();

const apiRouter = require('./api');

app.use(express.json());
app.use('/api', apiRouter);

app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
})