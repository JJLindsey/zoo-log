//const fs = require('fs')
//const path = require('path')
const express = require('express')
const PORT = process.env.PORT || 3001;
const app = express();
//const { animals } = require('./data/animals.json')
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

//create (instantiate) the server - start expressjs
// assing express() to app var to later chain on methods



//parse incomint string or array data - urlencoded converts POST data to key/value pairs accessed in req.body
app.use(express.urlencoded({ extended:true}));
//parse incoming JSON data
app.use(express.json());
//Express.js middleware that instructs server to make certain files readily available & o not gate it behind server endpoint.
app.use(express.static('public'));

//when client navigates to /api the app will use router set up in apiRoutes
//if / is endpoint the router will serve back HTML routes.
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);



//add route for FE to request data
// app.get('/api/animals', (req, res) => {
//     let results = animals;
//     console.log(req.query)
//     res.json(animals)
// })

//chain listen method to server to make server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});