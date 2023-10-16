const express = require("express");
const User = require("./Routes/User")
const mongoose = require("mongoose");
const cors = require("cors")

// global values
const port = process.env.PORT || 3000;



//connect to DB
mongoose.connect("mongodb+srv://salehmalik121:pKQqiyYUtcGvETfv@cluster0.oodu1bc.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("Connected With DataBase")
})
//server instance 
const app = express();
app.use(cors());


app.use("/User" , User);


app.listen(port , ()=>{
    console.log("listing on port " + port)
})