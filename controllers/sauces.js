const Sauces = require('../models/Sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    // recover + dissect the object
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId; //évite l'usurpation d'id
    // creation of the object
    const sauce = new Sauces({
        ...sauceObject,
        //extraction of userId from request object using middleware
        userId: req.auth.userId,
        //URL generation
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
                res.status(403).json({ message: "Modification non autorisée" });
            } else {
                Sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch((error) => { res.status(400).json({ error }) });
}

exports.deleteSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
        .then((sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: "Suppression non autorisée" });
            } else {
                // filname retrieval in URL
                const filename = sauce.imageUrl.split('/images/')[1];
                // suppressing sauce with unlink
                fs.unlink(`images/${filename}`, () => {
                    Sauces.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: "Sauce supprimée!" }) })
                        .catch(error => res.status(500).json({ error }))
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