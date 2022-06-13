const express = require('express');
const { fork } = require('child_process');

const router = express.Router();

router.get('/', async (req, res) => {
   const cant = req.query.cant ? req.query.cant : 100000000;
   
   const child = fork('./routes/child.js');

   child.send(cant); 

   child.on('message', childMsg => {
        res.send(childMsg); 
        child.send('end');
   });
});

module.exports = router;