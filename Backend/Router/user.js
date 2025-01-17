const express = require('express');
const { Getalluser, getuserprofile, signup, login, deleteprofile, updateProfile } = require('../Controller/user');
const authenticatetoken = require('../middleware/authmiddleware');

const router = express.Router();



router.get("/" , (req , res) => {
    console.log("home page");
    
})
router.get('/api/alluserprofile' ,Getalluser )
router.get('/user/:id' , getuserprofile)
router.post('/signup' , signup)
router.post('/login' , login)
router.put('/user/:id' ,authenticatetoken ,updateProfile)
router.delete('/user/:id' , authenticatetoken, deleteprofile)


module.exports = router