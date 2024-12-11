const { MongoClient } = require('mongodb');
const Repo = require('../models/repo');
const User = require('../models/user');
const mongoose = require('mongoose');
const multer = require('multer');
const { ObjectId } = mongoose.Types;


let client;
let url = process.env.MONGODB_URL


async function connectclient() {
    if (!client) {
        client = new MongoClient(url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
    }

}



async function createrepo(req, res) {
    const { owner, reponame, desc, visibility } = req.body;

    try {
        if (!reponame || !owner) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const fileData = req.files.map(file => ({
            filename: file.originalname,
            path: file.path,
        }));

        const newRepo = new Repo({
            reponame,
            desc,
            visibility: visibility === 'true',
            owner,
            files: fileData,
        });

        const result = await newRepo.save();

        res.json({
            message: "Repo created successfully with files uploaded",
            repo: result,
        });
    } catch (error) {
        console.error("Error creating repo:", error);
        res.status(500).json({ error: "Failed to create repo" });
    }
}

async function getallrepo(req, res) {
    try {
        

        const repos = await Repo.find({visibility:true});



        res.json({ message: "repo created", repos })

    } catch (error) {
        console.log(error);

    }

}



async function fetchrepobyid(req, res) {
    const { id } = req.params;  
    console.log("Received repoId:", id);

    
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid repoId format" });
    }

    try {
        
        const repo = await Repo.findById(id).populate('owner', 'username email');

        if (!repo) {
            return res.status(404).json({ error: "Repository not found" });
        }

        console.log("Fetched repo:", repo);

        
        res.json({
            message: "Repo fetched successfully",
            data: repo,
        });
    } catch (error) {
        console.error("Error fetching repo:", error);
        res.status(500).json({ error: "Failed to fetch repo" });
    }
}






async function fetchrepobycurretnuser(req, res) {
    const { userId } = req.params; 
    console.log(userId);
    

    try {
        const repos = await Repo.find({ owner: userId }).populate('owner', 'username email');
        res.json({ message: "Repos fetched", repos });
    } catch (error) {
        console.error("Error fetching repos:", error);
        res.status(500).json({ error: "Failed to fetch repos" });
    }
}



async function updaterepobyid(req, res) {
    const { id } = req.params;
    const { reponame, desc, visibility } = req.body;
    const files = req.files;  
  
    try {
      await connectclient();
      const db = client.db("Privgit");
      const repodb = db.collection("repo");
  
      const fileDetails = files ? files.map(file => ({
        filename: file.filename,
        path: `/uploads/${file.filename}`,
      })) : [];
  
      let updateData = {};
  
      
      if (reponame || desc || visibility !== undefined) {
        updateData = { reponame, desc, visibility };
      }
  
      
      if (files && files.length > 0) {
        updateData.$push = { files: { $each: fileDetails } }; 
      }
  
      
      const update = await repodb.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: 'after' }
      );
  
      if (update.value) {
        res.json({ message: "Repo updated successfully", update: update.value });
      } else {
        res.status(404).json({ message: "Repo not found" });
      }
  
    } catch (error) {
      console.error("Error during update:", error);
      res.status(500).json({ message: "Error updating the repo", error: error.message });
    }
  }


async function toggelvisbiltybyid(req, res) {
    const { userid } = req.params.id
    try {
        

        const update = await Repo.findOneAndUpdate({ userid },
            { $set: { visibility: { $not: "$visibility" } } },
            { returnDocument: 'after' }
        )



        res.json({ message: "Visibility toggled", updatedRepo: update.value });


    } catch (error) {
        console.log(error);

    }

}

async function deleterepobyid(req, res) {
    const { userid } = req.params.id

    try {
        await connectclient();
        const db = client.db("Privgit")
        const repodb = db.collection("repo")



        const update = await repodb.deleteOne({ userid })




        res.json({ message: "repo deleted" })

    } catch (error) {
        console.log(error);

    }

}

module.exports = {
    createrepo,
    getallrepo,
    fetchrepobycurretnuser,
    fetchrepobyid,
    updaterepobyid,
    toggelvisbiltybyid,
    deleterepobyid
}