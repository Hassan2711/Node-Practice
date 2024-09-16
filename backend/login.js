require('dotenv').config()

const express = require('express');
const cors = require('cors');

const app = express()

app.use(cors());
app.use(express.json());


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');  
const fetchUser = require('../middleware/fetchUser');

const JWT_SECRET = process.env.JWT_SECRET

const loginSchema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
})

const loginModel = mongoose.model("loginCredential", loginSchema)

app.post('/register', async(req,res)=>{
    try{
    const { name, email, password } = req.body;
    let existingUser = await loginModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password, salt);
    const user = new loginModel({
        name,
        email,
        password: hashedPw,
    });

    const val = await user.save();
    
    const data = {
        user:{
            id:user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({authtoken: authtoken});
    }
    catch (error){
        res.status(500).send("internal server error");
    }
})

app.post('/login', async(req,res)=>{
    const {email, password } = req.body;
    try{
        let user = await loginModel.findOne({email})
        if(!user){
            return res.status(400).json({error: "Wrong Credentials"});
        }
        const comparePw = await bcrypt.compare(password, user.password);
        if (!comparePw){
            return res.status(400).json({error: "Wrong Credentials"});
        }
        const payload = {
            user:{
                id: user.id
            }
        } 
        const authtoken = jwt.sign(payload,JWT_SECRET);
        res.json({authtoken: authtoken});
    }
    catch (error){
        res.status(500).send("internal server error");
    }
})
app.post('/getuser', fetchUser, async(req,res)=>{
    const {email, password } = req.body;

try {
    userId = req.user.id;
    const user = await loginModel.findById(userId).select("-password")
    res.send(user)
} catch (error) {
    res.status(500).send("internal server error");
}
})

app.listen(3001, () => {
    console.log("Server running on port 3001");
});