const { error } = require('console');
const Sauces = require('./models/Sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    // récupérer + décortiquer l'objet
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId; //évite l'usurpation d'id
    // création de l'objet
    const sauce = new Sauces({
        ...sauceObject,
        //extraction de l'userId de l'objet requête grâce au middleware
        userId: req.auth.userId,
        //génération de l'URL
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: "Sauce enregistrée !" }) })
        .catch(error => { res.status(400).json({ error }) })
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauces.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Modification non autorisée" });
            } else {
                Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => { res.status(400).json({ error }) });
}

exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Suppression non autorisée" });
            } else {
                // récupération du filname dans l'URL
                const filename = sauce.imageUrl.split('/images/')[1];
                // suppresion de la sauce avec unlink
                fs.unlink(`images/${filename}`, () => {
                    Sauces.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: "Sauce supprimée!" }) })
                        .catch(error => res.status(401).json({ error }))
                })
            }
        }))
        .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

exports.likeSauce = (req, res, next) => {

}