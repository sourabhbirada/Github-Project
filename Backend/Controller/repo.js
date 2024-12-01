const { MongoClient, ObjectId, ReturnDocument } = require('mongodb');


let client;
let url = process.env.MONGODB_URL


async function connectclient() {
    if(!client){
        client = new MongoClient(url , 
            {
                useNewUrlParser: true,
                useUnifiedTopology:true,
            }
        )
    }
    
}



async function createrepo(req , res) {
     const { onwer , reponame , desc , visibilty } = req.body

     try {
        await connectclient();
        const db = client.db("Privgit")
        const repodb = db.collection("repo")

        const newrepo = {
            reponame,
            desc,
            visibilty,
            owner:onwer
        }

        const result = await repodb.insertOne(newrepo)

        res.json({message:"repo created"})
        
     } catch (error) {
        console.log(error);
        
     }

     
    
}

async function getallrepo(req , res) {
    try {
        await connectclient();
        const db = client.db("Privgit")
        const repodb = db.collection("repo")

        const repos = await repodb.find({}).toArray();



        res.json({message:"repo created" , repos})
        
     } catch (error) {
        console.log(error);
        
     }
    
}

async function fetchrepobyid(req , res) {
    const {userId} = req.params.id
    try {
        await connectclient();
        const db = client.db("Privgit")
        const repodb = db.collection("repo")

        const repos = await repodb.find({userId}).toArray();



        res.json({message:"repo created" , repos})
        
     } catch (error) {
        console.log(error);
        
     }
    
}

async function fecthrepobyname(req , res) {
    const {name} = req.params.id
    try {
        await connectclient();
        const db = client.db("Privgit")
        const repodb = db.collection("repo")

        const repos = await repodb.find({name}).toArray();



        res.json({message:"repo created" , repos})
        
     } catch (error) {
        console.log(error);
        
     }
    
}

async function fetchrepobycurretnuser(req , res) {
    const {name} = req.params.id
    const userid = req.user

    try {
        await connectclient();
        const db = client.db("Privgit")
        const repodb = db.collection("repo")

        const repos = await repodb.find({owner:userid}).toArray();



        res.json({message:"repo created" , repos})
        
     } catch (error) {
        console.log(error);
        
     }
    
}

async function updaterepobyid(req , res) {
    
    const {userid} = req.params.id
    const { reponame , desc} = req.body
    try {
        await connectclient();
        const db = client.db("Privgit")
        const repodb = db.collection("repo")


        
        const update = await repodb.findOneAndUpdate({userid} , 
            {$set : {reponame , desc}},
            { returnDocument: 'after' }
        )




        res.json({message:"repo created" , update})
        
     } catch (error) {
        console.log(error);
        
     }
    
}

async function toggelvisbiltybyid(req , res) {
    const {userid} = req.params.id
    try {
        await connectclient();
        const db = client.db("Privgit")
        const repodb = db.collection("repo")

        const update = await repodb.findOneAndUpdate({userid},
            { $set: { visibility: { $not: "$visibility" } } }, 
            { returnDocument: 'after' }
        )



        res.json({ message: "Visibility toggled", updatedRepo: update.value });
        
        
     } catch (error) {
        console.log(error);
        
     }
    
}

async function deleterepobyid(req , res) {
    const {userid} = req.params.id
    
    try {
        await connectclient();
        const db = client.db("Privgit")
        const repodb = db.collection("repo")


        
        const update = await repodb.deleteOne({userid})




        res.json({message:"repo deleted" })
        
     } catch (error) {
        console.log(error);
        
     }
    
}

module.exports = {
    createrepo,
    getallrepo,
    fecthrepobyname,
    fetchrepobycurretnuser,
    fetchrepobyid,
    updaterepobyid,
    toggelvisbiltybyid,
    deleterepobyid
}