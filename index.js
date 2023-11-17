const express = require('express');
const boadyParser = require('body-parser');
const cors=require('cors')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
require('./database/db');
const path = require('./routes/router');

app.use(cors())


// app.use(express.json());
app.use(boadyParser.json())
app.use('/',path);




app.listen(port,(req,res)=>{
    console.log(`Working on Port http://localhost:${port}`);
})