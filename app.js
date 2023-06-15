const express = require('express');
const mongoose = require('mongoose');
const saucesRoutes = require('./routes/sauces');
const usersRoutes = require('./routes/users');
const path = require('path');

const app = express();

app.use((req, res) => {
    express.json({ message: 'Votre requête a bien été reçue !' });
});

//Mongoose connection
mongoose.connect('mongodb+srv://clarissebouy:essiralc@cluster0.trkl226.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Sauces
app.use('/api/sauces', saucesRoutes);
// Users
app.use('/api/auth', usersRoutes);
// Images
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;