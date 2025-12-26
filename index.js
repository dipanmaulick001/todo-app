const express =require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "asdbjsdnsbjd1234";
const {UserModel , TodoModel} = require('./db'); //importing from db.js
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://dip25:33nT3qCIU6ZEUPD5@cluster0.dgnaxig.mongodb.net/todo-app");

const app = express();
app.use(express.json());

app.post("/signup" , async function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    await UserModel.create({       //async , returns promise since it goes to the db in mumbai
        email : email,
        password : password,
        name : name
    })

    res.json({
        message : "Account created."
    })
})

app.post("/login" , async function(req ,res){
    const email = req.body.email;
    const password = req.body.password;

    const user = await UserModel.findOne({   //all db calls are async
        email : email,
        password : password
    })

    if (user){
        const token = jwt.sign({
            id : user._id
        },JWT_SECRET)
        res.json({
            toekn : token
        })
    }else{
        return res.status(401).json({
            message : "Invalid credentials"
        })
    }

})

app.post("/todo" , function(req, res){

})

app.get("/todos" , function(req ,res){

})

app.listen(3000);