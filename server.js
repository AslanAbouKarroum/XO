const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config();
const PORT = 3000;

const app = express();

// Middleware
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use('/public', express.static('public'));


app.get('/',(req, res)=>{
    res.sendFile(__dirname + '/public/index.html')
})

// app.post('/press',(req,res)=>{
    
// })


// Start server
app.listen( process.env.PORT || PORT, ()=>{
    console.log(`Server connected on ${PORT}`)
})