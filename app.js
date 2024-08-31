require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Use environment variable for MongoDB connection URI
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));


// Define the schema
const UserSchema = new mongoose.Schema({
    name: String,
    age: Number,
    dateOfBirth: Date
});

// Create the model
const User = mongoose.model('User', UserSchema);

app.post('/addUser', async (req, res) => {
    try {
        const { name, age, dateOfBirth } = req.body;
        // Create a new user instance from the request body
        const newUser = new User({
            name,
            age,
            dateOfBirth});

        // Save the user to the database
        const savedUser = await newUser.save();

        // Send a success response
        res.status(201).json(savedUser);
    } catch (err) {
        // Handle errors
        res.status(400).json({ message: err.message });
    }
});

const users = [
    { name: "Alice Johnson", age: 25, dateOfBirth: "1998-03-14" },
    { name: "Bob Smith", age: 30, dateOfBirth: "1993-07-22" },
    { name: "Charlie Brown", age: 35, dateOfBirth: "1988-11-10" }
];


const addStaticData = async () => {
    try {
        await User.insertMany(users); // Insert the static dataset
        console.log("Static data added to MongoDB");
    } catch (err) {
        console.error("Error adding static data:", err);
    }
};

addStaticData();

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
