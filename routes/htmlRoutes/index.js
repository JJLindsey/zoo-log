const path = require('path');
const router = require('express').Router();

//respond with an HTML page to display in the browser
//path module ensures finding the correct location for the HTML code to display in the browser. 
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});
//route takes to animals
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

//any route not defined will go to this request and recive homepage as response
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});
module.exports = router;