const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UtilisateursSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

UtilisateursSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Utilisateurs', UtilisateursSchema);