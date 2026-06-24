require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT;
const ORIGIN = process.env.ORIGIN;
const app = express();

const apiRouter = require('./api');

app.get('/keep-alive', (req, res)=>{
    res.send("Keep alive");
});

setInterval(()=>{
    fetch(`${req.protocol}://${req.get('host')}/keep-alive`)
        .then(()=>console.log("Pinged self to stay alive."))
        .catch((err)=>console.error("Ping failed : ", err.message));
}, 5 * 60 *1000);

app.use(express.json());
app.use(cors({
    origin : ORIGIN
}));
app.use('/api', apiRouter);

app.listen(PORT, ()=>{
    console.log(`App is listening on port ${PORT}`);
})