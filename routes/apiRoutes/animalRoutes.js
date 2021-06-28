const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

//access query properties on req object
//callback function
router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});
//callback function that req servre to accept data
router.post('/animals', (req, res) => {
    //req.body is where incoming content will be - req.body is property where we can access data on server side
    //console.log(req.body);
    //set id based on next available index of the array 
    req.body.id = animals.length.toString();
    //add animal to json file & animals array in this function
    //if any data in req.body is incorrect, send 404 error
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
    const animal = createNewAnimal(req.body, animals);
    //res.json method send data back to client
    res.json(animal);
    }
});


module.exports = router;