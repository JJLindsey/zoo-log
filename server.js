const fs = require('fs')
const path = require('path')
const express = require('express')
const { animals } = require('./data/animals.json')
//create (instantiate) the server - start expressjs
// assing express() to app var to later chain on methods
const PORT = process.env.PORT || 3001;
const app = express();

//parse incomint string or array data - urlencoded converts POST data to key/value pairs accessed in req.body
app.use(express.urlencoded({ extended:true}));
//parse incoming JSON data
app.use(express.json());

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array.
        // If personalityTraits is a string, place it into a new array and save.
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
}

//add route for FE to request data
// app.get('/api/animals', (req, res) => {
//     let results = animals;
//     console.log(req.query)
//     res.json(animals)
// })

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal(body, animalsArray) {
    //console.log(body);
    //functions main code
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray}, null, 2)
    );
    //return finished code to post route for response
    return animal;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;
}
//access query properties on req object
//callback function
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
});
//callback function that req servre to accept data
app.post('/api/animals', (req, res) => {
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

//chain listen method to server to make server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});