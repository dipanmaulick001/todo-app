const bcrypt = require("bcrypt");
const express =require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "asdbjsdnsbjd1234";
const {UserModel , TodosModel} = require('./db'); //importing from db.js
const {auth , JWT_SECRET} = require("./auth")
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://dip25:33nT3qCIU6ZEUPD5@cluster0.dgnaxig.mongodb.net/todo-app");

const app = express();
app.use(express.json());

app.post("/signup" , async function(req,res){
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    let errorThrown = false;
    try{
        //we take pw from user bt in db, we store hashed pw
        const hashedPassword = await bcrypt.hash(password , 5 ) //promisified approach, no 3rd arg

        await UserModel.create({       //async , returns promise since it goes to the db in mumbai
            email : email,
            password : hashedPassword,
            name : name
        })

      
    }catch(e){
        res.json({
            message : "user already exists"
        })
        errorThrown = true;
    }

    if(!errorThrown){
        res.json({
            message :"Account created"
        })
    }
    //we can have only one res in a req
})

app.post("/login" , async function(req ,res){
    const email = req.body.email;
    const password = req.body.password;

    const response = await UserModel.findOne({   //all db calls are async
        email : email
    })

    if (!response){
        res.status(403).json({
            message : "User doesnt exist in the db"
        })
        return
    }
    //if email matches , then we compare the passwords

    const passwordMatch = await bcrypt.compare(password , response.password);

    if(passwordMatch){
        const token = jwt.sign({
            id : response._id.toString()
        },JWT_SECRET);
        return res.json({
            token : token
        })
    }else{
        res.status(403).json({
            message : "incorrect credentials"
        })
    }


})

app.post("/todo" ,auth, async function(req, res){
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodosModel.create({
        title,
        userId,
        done
    })

    res.json({
        message : "Todo created"
    })

})

app.get("/todos" , auth, async function(req ,res){
    const userId = req.userId;
    const todos = await TodosModel.find({
            userId : userId
    })

    res.json({
        todos
    })

})



app.listen(3000);