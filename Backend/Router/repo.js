const express = require('express');
const { createrepo, getallrepo, fetchrepobyid, fecthrepobyname, fetchrepobycurretnuser, updaterepobyid, deleterepobyid, toggelvisbiltybyid } = require('../Controller/repo');
const authenticatetoken = require('../middleware/authmiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');


const router = express.Router();


router.post('/repo/create', uploadMiddleware  , createrepo )
router.get('/repo/all' , getallrepo)
router.get('/repo/id/:id' , fetchrepobyid)
router.get('/repo/user/:userId', fetchrepobycurretnuser)
router.put('/repo/update/:id', uploadMiddleware , updaterepobyid)
router.delete('/repo/delete' , deleterepobyid)
router.patch('/repo/toggle/:id' , toggelvisbiltybyid)

module.exports = router