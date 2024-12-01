const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const { MongoClient, ObjectId, ReturnDocument } = require('mongodb');


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

async function signup(req , res) {
    const { username , password , email} = req.body

    try {
        await connectclient();
        const db = client.db("Privgit");
        const userdb = db.collection("users")

        const user = await userdb.findOne({username})
        if(user){
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password , salt);

        const newuser = {
            username,
            password:hashpassword,
            email,
            repositoties : [],
            followedusers: [],
            starrepos:[],
        }

        const result = await userdb.insertOne(newuser)

        const token = await jwt.sign({id:result.insertId} , process.env.JWT_KEY)
        res.json(token)
    } catch (error) {
        console.log("Server error" , error);
        
    }
    
}

async function getuserprofile(req , res) {
    const userid = req.params.id;

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

        res.json(user)
    } catch (error) {
        console.log(error);   
    }
    
}

async function updateprfile(req , res) {
    const userid = req.params.id;
    const {email , password} = req.body

    try {
        await connectclient();
        const db = client.db("Privgit")
        const userdb = db.collection("users")

        let updatefield = { email }
        if(password) {
            const salt = await bcrypt.genSalt(10)
            const hashpassword = await bcrypt.hash(password , salt)
            updatefield.password = hashpassword;
        }

        const result = await userdb.findOneAndUpdate({
            _id:new ObjectId(userid)
        },
        {$set:updatefield} , 
        {returnDocument:"after"});

        if(!result.value){
            return res.json({message:"not found"})
        }

        res.send(result.value)
    } catch (error) {
        console.log(error);   
    }
    
}

async function deleteprofile(req , res) {
    const userid = req.params.id;

    try {
        await connectclient();
        const db = client.db("Privgit")
        const userdb = db.collection("users")

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

async function login(req , res) {
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
            return res.json({message:"galat baat"})

        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_KEY);
        res.json({token , 
            username:user.username
        })
    } catch (error) {
        console.log("Server error" , error);
        
    }
    
}

module.exports = {
    Getalluser,
    signup,
    login,
    getuserprofile,
    updateprfile,
    deleteprofile
}