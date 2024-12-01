const express = require('express');
const { createrepo, getallrepo, fetchrepobyid, fecthrepobyname, fetchrepobycurretnuser, updaterepobyid, deleterepobyid, toggelvisbiltybyid } = require('../Controller/repo');

const router = express.Router();


router.post('/repo/create' , createrepo )
router.get('/repo/all' , getallrepo)
router.get('/repo/id/:id' , fetchrepobyid)
router.get('/repo/name/:name' , fecthrepobyname)
router.get('/repo/user/:userid' ,fetchrepobycurretnuser)
router.put('/repo/update/:id' , updaterepobyid)
router.delete('/repo/delete' , deleterepobyid)
router.patch('/repo/toggle/:id' , toggelvisbiltybyid)

module.exports = router