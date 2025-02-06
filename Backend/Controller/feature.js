const Repo = require("../models/repo");
const User = require("../models/user");



async function Starrepo(req , res) {

    const {repoId} = req.params
    const {userId} = req.body


    
    

    try {
        const user = await User.findById(userId)
        if(!user){
            res.status(400).json({message:"Login first to star a repo"})
        }

        const repo = await Repo.findById(repoId)
        if(!repo){
            res.status(404).json({message:'Repo not found'})
        }

        if(!user.repositories.includes(repoId)){
            user.repositories.push(repoId)
            await user.save()
            return res.status(200).json({message:"repo added"})
        }
        else{
            return res.status(404).json({message:"repo already added"})
        }
    } catch (error) {
        res.status(400).json({message:"Faild to star"})
        console.log(error);
    }
    
}

async function Getalluserstarrepo(req , res) {

    const {userId} = req.body

    try {

        const user = await User.findById(userId)

        if(!user) return res.status(404).json({message:"user not found"})
        
        const userstarrepo = user.repositories

        return res.status(200).json({message:"Show all star repo" , userstarrepo } )
        
    } catch (error) {
        res.status(400).json({message:"We found some error"})
    }
    
}





module.exports = {
    Starrepo,
    Getalluserstarrepo
}