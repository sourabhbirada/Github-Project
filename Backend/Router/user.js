const express = require('express');
const { Getalluser, getuserprofile, signup, login, deleteprofile, updateProfile, Newfollower } = require('../Controller/user');
const authenticatetoken = require('../middleware/authmiddleware');

const router = express.Router();




router.get('/api/alluserprofile' ,Getalluser )
router.get('/:id',authenticatetoken, getuserprofile)
router.post('/signup' , signup)
router.post('/login' , login)
router.put('/:id' ,authenticatetoken ,updateProfile)
router.delete('/:id' , authenticatetoken, deleteprofile)
router.post('/follower/:id' , Newfollower)


module.exports = router