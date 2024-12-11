const express = require('express');
const { Getalluser, getuserprofile, signup, login, deleteprofile, updateProfile } = require('../Controller/user');

const router = express.Router();



router.get("/" , (req , res) => {
    console.log("home page");
    
})



router.get('/api/alluserprofile' ,Getalluser )//later when we will work on auth
router.get('/user/:id' , getuserprofile)
router.post('/signup' , signup)
router.post('/login' , login)
router.put('/user/:id' ,updateProfile)
router.delete('/user/:id' , deleteprofile)


module.exports = router