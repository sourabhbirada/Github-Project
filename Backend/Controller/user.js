const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId, ReturnDocument } = require('mongodb');
const Repo = require("../models/repo");


let client;
let uri = process.env.MONGODB_URL

async function connectclient() {
    if(!client){
        client = new MongoClient(uri , {
            useNewUrlParser: true,
            useUnifiedTopology:true,
        })
    }
}

async function Getalluser(req , res) {
    
    try {
        await connectclient();
        const db = client.db("Privgit")
        const userdb = db.collection("users")

        const users = await userdb.find({}).toArray();

        res.json(users)
    } catch (error) {
        console.log(error);
    }  
}

async function signup(req, res , next) {
    const { username, password, email } = req.body

    try {
        await connectclient();
        const db = client.db("Privgit");
        const userdb = db.collection("users")
        const user = await userdb.findOne({ $or: [{ username }, { email }] })
        if (user) {
            return res.status(400).json({ error: "Duplicate entry detected" });
        }
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password, salt);
        const newuser = {
            username,
            password: hashpassword,
            email,
            repositoties: [],
            followedusers: [],
            starrepos: [],
        }
        const result = await userdb.insertOne(newuser)
        const token = await jwt.sign({ id: result.insertedId }, process.env.JWT_KEY);
        res.cookie('token' , token, {
            httpOnly: true ,
            secure: true,         
            sameSite: 'none',  } ).status(202).json({message:"User Created", token, userId: result.insertedId});
    } catch (error) {
        next(error);
    }
}

async function getuserprofile(req , res , next) {
    const userid = req.params.id;
    console.log(userid);
    console.log('Cookies:', req.cookies);
    
    
    try { 
        await connectclient();
        const db = client.db("Privgit")
        const userdb = db.collection("users")
        const user = await userdb.findOne({
            _id:new ObjectId(userid)
        });
        if(!user){   
            return res.status(400).json({ message: "User already exists" });
        } 
        res.status(202).json({message:'user found' , user})
    } catch (error) {
        next(error) 
    }
}

async function updateProfile(req, res) {
    const userid = req.params.id;
    const { updatefield } = req.body;
    if (!updatefield.email && !updatefield.username) {
      return res.status(400).json({ message: "Email or username must be provided" });
    }
  
    try {
      await connectclient(); 
      const db = client.db("Privgit");
      const userdb = db.collection("users");
  
      const updateFields = {};
      if (updatefield.email) updateFields.email = updatefield.email;
      if (updatefield.username) updateFields.username = updatefield.username;
  
      const result = await userdb.findOneAndUpdate(
        { _id: new ObjectId(userid) },
        { $set: updateFields },
        { returnDocument: "after" }
      );      
      if (!result) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json( {message:"User updated" , result}); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

async function deleteprofile(req , res) {
    const userid = req.params.id;

    try {
        await connectclient();
        const db = client.db("Privgit")
        const userdb = db.collection("users")

        await Repo.deleteMany({ owner: new ObjectId(userid) });

        const user = await userdb.deleteOne({
            _id:new ObjectId(userid)
        });

        if(user.deletecount == 0){
            return res.status(400).json({ message: "User already exists" });
        }

        res.json({message:"deleted"})
    } catch (error) {
        console.log(error);   
    }
    
}

async function login(req , res , next) {
    const { password , email} = req.body
    try {
        await connectclient();
        const db = client.db("Privgit");
        const userdb = db.collection("users")

        const user = await userdb.findOne({email})
        if(!user){
            return res.status(400).json({ message: "User not found" });
        }
        const ismatch = await bcrypt.compare(password , user.password)
        if(!ismatch){
            return res.status(400).json({message:"galat baat"})
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);

        res.cookie('token' , token, {
            httpOnly: true ,
            secure: true,         
            sameSite: 'none',  } ).status(202).json({ message:" user found" , token , 
            username:user.username,
            userId:user._id
        }) 
    } catch (error) {
        next(error) 
    }
}

module.exports = {
    Getalluser,
    signup,
    login,
    getuserprofile,
    updateProfile,
    deleteprofile
}