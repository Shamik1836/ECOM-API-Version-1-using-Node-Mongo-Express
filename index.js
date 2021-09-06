const express=require('express');
const dotenv=require('dotenv').config()
const port=process.env.PORT;
const app=express();
const db=require('./config/mongoose');


app.use(express.json());
app.use('/',require('./routes'))


app.listen(port,()=>console.log('listening on port',port));

