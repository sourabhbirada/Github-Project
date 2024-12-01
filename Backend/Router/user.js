const express = require('express');
const { Getalluser, getuserprofile, signup, login, updateprfile, deleteprofile } = require('../Controller/user');

const router = express.Router();



router.get("/" , (req , res) => {
    console.log("home page");
    
})



router.get('/alluserprofile' ,Getalluser )
router.get('/user/:id' , getuserprofile)
router.post('/signup' , signup)
router.post('/login' , login)
router.put('/user/:id' ,updateprfile)
router.delete('/user/:id' , deleteprofile)


module.exports = router