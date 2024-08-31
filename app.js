require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));


const UserSchema = new mongoose.Schema({
    name: String,
    age: Number,
    dateOfBirth: Date
});

const User = mongoose.model('User', UserSchema);

app.post('/addUser', async (req, res) => {
    try {
        const { name, age, dateOfBirth } = req.body;
        const newUser = new User({
            name,
            age,
            dateOfBirth});

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const users = [
    { name: "Alice", age: 25, dateOfBirth: "1998-03-14" },
    { name: "Bob", age: 30, dateOfBirth: "1993-07-22" },
    { name: "Jhon", age: 35, dateOfBirth: "1988-11-10" }
];


const addStaticData = async () => {
    try {
        await User.insertMany(users);
        console.log("Static data added to MongoDB");
    } catch (err) {
        console.error("Error adding static data:", err);
    }
};

addStaticData();

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
