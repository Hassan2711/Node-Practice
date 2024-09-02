require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')

const app = express()
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const schema = {
    name: String,
    email:String,
    id: Number
}

const testModel = mongoose.model("NewData", schema);

app.post('/post',async(req,res)=>{
    console.log('inside post');
    const data = new testModel({
        name: req.body.name,
        email: req.body.email,
        id: req.body.id
    })

    const val = await data.save()
    res.json(val)
})

app.put("/update/:id", async (req,res)=>{
    let upid = req.params.id;
    let upname = req.body.name;
    let upemail = req.body.email;

   
    const updatedData = await testModel.findOneAndUpdate(
        { id: upid },
        { $set: { name: upname, email: upemail } },
        { new: true } 
      );
  
      if (!updatedData) {
        res.send("No data found");
      } else {
        res.send(updatedData);
      } 

})

app.get('/fetch/:id',async (req,res)=>{
    let fetchId = req.params.id;
    const oldData = await testModel.find({id:fetchId}) 
    if (oldData.length > 0){
        res.send(oldData)
    }
    else{
        res.send('No old Data found')
    }
})

app.delete('/delete/:id', async ( req,res)=>{
    let delId = req.params.id;

    let DatatoDelete = await testModel.findOneAndDelete({id:delId})
    if (DatatoDelete){
        res.send(DatatoDelete)
    }
    else{
        res.send('no data to delete found')
    }
})


    
app.listen(3001, () => {
    console.log("Server running on port 3001");
});
