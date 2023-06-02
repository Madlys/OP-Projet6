const express = require('express');

const mongoose = require('mongoose');

const app = express();

app.use((req, res) => {
    express.json({ message: 'Votre requête a bien été reçue !' });
});

//connexion à Mongoose
mongoose.connect('mongodb+srv://clarissebouy:essiralc@cluster0.trkl226.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

    
module.exports = app;