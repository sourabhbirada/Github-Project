const express = require('express');
const { Starrepo, Getalluserstarrepo } = require('../Controller/feature');
const authenticatetoken = require('../middleware/authmiddleware');


const router = express.Router();



router.post('/repo/star/:repoId' , authenticatetoken, Starrepo)
router.get('/repo/star' , Getalluserstarrepo)



module.exports = router;