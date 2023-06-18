const express = require('express');
const mongoose = require('mongoose');
const saucesRoutes = require('./routes/sauces');
const usersRoutes = require('./routes/users');
const path = require('path');

//Mongoose connection
mongoose.connect('mongodb+srv://clarissebouy:essiralc@cluster0.trkl226.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((request, response, next) => {
    //authorization for everyone to access the API ('*')
    response.setHeader('Access-Control-Allow-Origin', '*');
    //authorization to add certain headers (listed after the comma) to sent requests
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //authorization to send requests using certain methods (listed after the comma)
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

// Sauces
app.use('/api/sauces', saucesRoutes);
// Users
app.use('/api/auth', usersRoutes);
// Images
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;