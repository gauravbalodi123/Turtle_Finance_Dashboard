const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

// const {seedClientDB} = require('./clientseed');
// const {seedAdvisorDB} = require('./advisorsSeed');

const {clientRoutes} = require('./routes/clientRoutes');
const {advisorRoutes} = require('./routes/advisorRoutes');
const {meetingAndTasksRoutes} = require('./routes/meetingAndTaskRoutes')
const {firefliesRouter} = require('./fireFlies/fetchFromFireflies')
const {rowWiseTaskRoutes} = require('./routes/rowWiseTaskRoutes')
const cors = require('cors');


const port = process.env.PORT || 8000;
mongoose.connect(process.env.DB_URL)
.then(()=>{console.log('connection open to DB')})
.catch((err)=>{console.log(err)});

app.use(express.json());
app.get('/' , (req,res)=>{
    res.status(200).json({msg:'hello from turtle finance server'}) 
})

// seedClientDB();
// seedAdvisorDB();


app.use(express.json());

app.use(cors());

app.use(clientRoutes);
app.use(advisorRoutes);
app.use(firefliesRouter);
app.use(meetingAndTasksRoutes);
app.use(rowWiseTaskRoutes);
 

app.listen(port , ()=>{
    console.log(`server started at ${port}`)
})


