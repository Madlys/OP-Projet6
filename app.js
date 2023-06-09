const express = require('express');

const mongoose = require('mongoose');

const saucesRoutes = require('./routes/sauces');
const utilisateursRoutes = require('./routes/utilisateurs');

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
// Utilisateurs
app.use('./api/auth', utilisateursRoutes);
//Images
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;