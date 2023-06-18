const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

exports.signup = (request, response, next) => {
    bcrypt.hash(request.body.password, 10)
        .then(hash => {
            const user = new User({
                email: request.body.email,
                password: hash
            });

            user.save()
                .then(() => {
                    response.status(201).json({ message: 'Utilisateur créé!' })
                })
                .catch(error => response.status(400).json({ error }));
        })
        .catch(error => response.status(500).json({ error }));
};

exports.login = (request, response, next) => {
    User.findOne({ email: request.body.email })
        .then(user => {
            if (user === null) {
                response.status(401).json({ message: 'Votre identifiant ou votre mot de passe est incorrecte' })
            } else {
                bcrypt.compare(request.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            response.status(401).json({ message: 'Votre identifiant ou votre mot de passe est incorrecte' });
                        } else {
                            response.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    'RANDOM_SECRET_TOKEN',
                                    { expiresIn: '24h' }
                                )
                            });
                        }
                    })
                    .catch(error => { response.status(500).json({ error }) })
            }
        })
        .catch(error => { response.status(500).json({ error }) });
};