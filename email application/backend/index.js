const express = require('express');
const {userRoute} = require('../backend/userRoute');
const { connection } = require('../backend/db');


const app = express();
app.use(express.json());


app.use('/users',userRoute);

app.listen(8080,async()=>{
    await connection;
    console.log('coonected to db');
    console.log('server is running at port 8080');
})