const express = require('express');

const mongoose = require('mongoose');

const saucesRoutes = require('./routes/sauces')

const app = express();

app.use((req, res) => {
    express.json({ message: 'Votre requête a bien été reçue !' });
});

//Connexion à Mongoose
mongoose.connect('mongodb+srv://clarissebouy:essiralc@cluster0.trkl226.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Sauces
app.use('/api/sauces', saucesRoutes);

module.exports = app;