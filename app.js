const express = require('express');
const mongoose = require('mongoose');
const saucesRoutes = require('./routes/sauces');
const utilisateursRoutes = require('./routes/utilisateurs');
const path = require('path');

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

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
// });
// app.use(express.json());

// Sauces
app.use('/api/sauces', saucesRoutes);
// Utilisateurs
app.use('/api/auth', utilisateursRoutes);
//Images
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;