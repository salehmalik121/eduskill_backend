const express = require("express");
const bodyParser = require('body-parser');
const { Configuration, OpenAI } = require('openai');
const User = require("../classes/User/User");
const userModel = require("../Schema/Users");
const jwt = require("jsonwebtoken");


const Router = express.Router();
const key ="a4e27f15bb12d99897a30b35ead719a81ad6a37ade8b0f0251453b2ebc03a600";

Router.post("/Writingconversation" , bodyParser.json() , async(req , res , next)=>{

    const body = req.body;
    const userMessage = body.content;
    const userToken = body.token;
    const payload = jwt.verify(userToken, key);

    console.log(payload);

    let chatHistory = [];
    await userModel.findOne({"Email" : payload.Email}).then(async(data)=>{
        if(data.MessagesLeft == 0){
            res.status(203).json({
                "message" : "Your plan limit is exceeded please upgrade your plan."
            })
        }else{
            const newUpdate = data.MessagesLeft-1;
            await userModel.findOneAndUpdate({"Email" : payload.Email}, {"MessagesLeft" : newUpdate})
            chatHistory = [...data.WrittenChat];
        }
    })



      const openai = new OpenAI({
        apiKey: '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', 
      });
        const message = userMessage;
        let messagePrompt
        if(chatHistory.length === 0){
             messagePrompt = [
                {	role : "system" , content : "Your are teacher AI, please create a basic IELTS mock test covering Writing: Provide a simple statement and ask the student to write a short paragraph about it. Also, include a topic for a brief essay. check my answers using conversational memory also at final answer tell where i stand send me don't tell me answers just questions  important : if student ask for some other info do answer but not after test "},      
                { role: "user", content: message },
            ];
        }else{
             messagePrompt = [
                {	role : "system" , content : "Your are teacher AI, please create a basic IELTS mock test covering Writing: Provide a simple statement and ask the student to write a short paragraph about it. Also, include a topic for a brief essay. check my answers using conversational memory also at final answer tell where i stand send me don't tell me answers just questions  important : if student ask for some other info do answer but not after test "},      
                ,
                ...chatHistory
                ,
                { role: "user", content: message },
            ];
        }

        const filteredMessagePrompt = messagePrompt.filter(element => element !== undefined);
          console.log(filteredMessagePrompt);
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: filteredMessagePrompt,
            max_tokens: 2024,
            n: 1,
            
            temperature: 0.5,
            
        });
        try{
        const output = response.choices[0].message;
        const jsonObject = output;
        console.log(jsonObject);
        chatHistory.push({role : "user" , content: message});
        chatHistory.push(jsonObject);
        await userModel.findOneAndUpdate({"Email" : payload.Email}, {"WrittenChat" : chatHistory})
        res.status(200).json(jsonObject);
        }catch(err){
            console.log(err);
        res.status(500).json(err);
        }

}  )

Router.post("/loadWritingConversation" , bodyParser.json() , async(req , res, next)=>{
    const body = req.body;
    const userToken = body.token;
    const payload = jwt.verify(userToken, key);

    const data = await userModel.findOne({"Email" : payload.Email})
    res.status(200).json(data.WrittenChat);

})

Router.post("/Speakingconversation" , bodyParser.json() , async(req , res , next)=>{

    const body = req.body;
    const userMessage = body.content;
    const userToken = body.token;
    const payload = jwt.verify(userToken, key);

    console.log(payload);

    let chatHistory = [];
    await userModel.findOne({"Email" : payload.Email}).then(async(data)=>{
        if(data.MessagesLeft == 0){
            res.status(203).json({
                "message" : "Your plan limit is exceeded please upgrade your plan."
            })
        }else{
            const newUpdate = data.MessagesLeft-1;
            await userModel.findOneAndUpdate({"Email" : payload.Email}, {"MessagesLeft" : newUpdate})
            chatHistory = [...data.SpeakingChat];
        }
    })



      const openai = new OpenAI({
        apiKey: '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', 
      });
        const message = userMessage;
        let messagePrompt
        if(chatHistory.length === 0){
             messagePrompt = [
                {	role : "system" , content : "Your are teacher AI, please create a basic IELTS mock test covering Reading: Generate short passages and include questions like multiple choice or true/false to test comprehension. check my answers using conversational memory also at final answer tell where i stand send me don't tell me answers just questions  important : if student ask for some other info do answer but not after test "},      
                { role: "user", content: message },
            ];
        }else{
             messagePrompt = [
                {	role : "system" , content : "Your are teacher AI, please create a basic IELTS mock test covering Reading: Generate short passages and include questions like multiple choice or true/false to test comprehension. Also, include a topic for a brief essay. check my answers using conversational memory also at final answer tell where i stand send me don't tell me answers just questions  important : if student ask for some other info do answer but not after test "},      
                ,
                ...chatHistory
                ,
                { role: "user", content: message },
            ];
        }

        const filteredMessagePrompt = messagePrompt.filter(element => element !== undefined);
          console.log(filteredMessagePrompt);
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: filteredMessagePrompt,
            max_tokens: 2024,
            n: 1,
            
            temperature: 0.5,
            
        });
        try{
        const output = response.choices[0].message;
        const jsonObject = output;
        console.log(jsonObject);
        chatHistory.push({role : "user" , content: message});
        chatHistory.push(jsonObject);
        await userModel.findOneAndUpdate({"Email" : payload.Email}, {"SpeakingChat" : chatHistory})
        res.status(200).json(jsonObject);
        }catch(err){
            console.log(err);
        res.status(500).json(err);
        }

}  )

Router.post("/loadSpeakingConversation" , bodyParser.json() , async(req , res, next)=>{
    const body = req.body;
    const userToken = body.token;
    const payload = jwt.verify(userToken, key);

    const data = await userModel.findOne({"Email" : payload.Email})
    console.log(data);
    res.status(200).json(data.SpeakingChat);

})



module.exports = Router;