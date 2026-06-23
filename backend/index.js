require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT;
const ORIGIN = process.env.ORIGIN;
const app = express();

const apiRouter = require('./api');

app.use(express.json());
app.use(cors({
    origin : ORIGIN
}));
app.use('/api', apiRouter);

app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
})