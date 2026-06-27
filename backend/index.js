require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT;
const ORIGIN = process.env.ORIGIN;
const ORIGIN2 = process.env.ORIGIN2;
const BASE_URL = process.env.BASE_URL;
const app = express();

const apiRouter = require('./api');

app.get('/keep-alive', (req, res)=>{
    res.send("Keep alive");
});

setInterval(()=>{
    fetch(`${BASE_URL}/keep-alive`)
        .then(()=>console.log("Pinged self to stay alive."))
        .catch((err)=>console.error("Ping failed : ", err.message));
}, 5 * 60 *1000);

app.use(express.json());
app.use(cors({
    origin : [ORIGIN, ORIGIN2]
}));
app.use('/api', apiRouter);

app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
})