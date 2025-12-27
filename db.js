const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;


const User = new Schema({
    email : {type: String, unique: true},
    password : String,
    name : String
})

const Todos = new Schema({
    title : String,
    done : Boolean,
    userId : ObjectId
})

//We need a data model on which we can call the functions 
const UserModel = mongoose.model('users' , User)
const TodosModel = mongoose.model('todos' , Todos)