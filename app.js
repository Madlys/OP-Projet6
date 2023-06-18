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

app.use((req, res, next) => {
    //autorisation d'accès à l'API par tout le monde ('*')
    res.setHeader('Access-Control-Allow-Origin', '*');
    //autorisation d'ajouter certains headers (listés après la virgule) aux requêtes envoyés
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //autorisation d'envoyer des requêtes avec certaines méthodes (listées la virgule)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
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