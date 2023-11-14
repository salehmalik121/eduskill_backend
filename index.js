const express = require("express");
const User = require("./Routes/User")
const mongoose = require("mongoose");
const Chat = require("./Routes/Chat")

// global values
const port = process.env.PORT || 3000;



//connect to DB
mongoose.connect("mongodb+srv://salehmalik121:pKQqiyYUtcGvETfv@cluster0.oodu1bc.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("Connected With DataBase")
})
//server instance 
const app = express();



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    // You can include more headers if needed
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  });



app.use("/User" , User);
app.use("/Chat" , Chat);


app.listen(port , ()=>{
    console.log("listing on port " + port)
})