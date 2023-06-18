const Sauces = require('../models/Sauces');
const fs = require('fs');

exports.createSauce = (request, response, next) => {
    console.log("create")
    // recover + dissect the object
    const sauceObject = JSON.parse(request.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId; //prevents id usurpation
    // creation of the object
    const sauce = new Sauces({
        ...sauceObject,
        //extraction of userId from request object using middleware
        userId: request.auth.userId,
        //URL generation
        imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
    });

    sauce.save()
        .then(() => { response.status(201).json({ message: "Sauce enregistrée !" }) })
        .catch(error => { response.status(400).json({ error }) })
}

exports.modifySauce = (request, response, next) => {
    const sauceObject = request.file ? {
        ...JSON.parse(request.body.sauce),
        imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
    } : { ...request.body };

    delete sauceObject._userId;
    Sauces.findOne({ _id: request.params.id })
        .then((sauce) => {
            if (sauce.userId != request.auth.userId) {
                response.status(403).json({ message: "Modification non autorisée" });
            } else {
                Sauces.updateOne({ _id: request.params.id }, { ...sauceObject, _id: request.params.id })
                    .then(() => response.status(200).json({ message: "Sauce modifiée!" }))
                    .catch(error => response.status(500).json({ error }));
            }
        })
        .catch((error) => { response.status(400).json({ error }) });
}

exports.deleteSauce = (request, response, next) => {
    Sauces.findOne({ _id: request.params.id })
        .then((sauce => {
            if (sauce.userId != request.auth.userId) {
                response.status(403).json({ message: "Suppression non autorisée" });
            } else {
                // filname retrieval in URL
                const filename = sauce.imageUrl.split('/images/')[1];
                // deleting sauce with unlink
                fs.unlink(`images/${filename}`, () => {
                    Sauces.deleteOne({ _id: request.params.id })
                        .then(() => { response.status(200).json({ message: "Sauce supprimée!" }) })
                        .catch(error => response.status(500).json({ error }))
                })
            }
        }))
        .catch(error => response.status(400).json({ error }));
}

exports.getOneSauce = (request, response, next) => {
    Sauces.findOne({ _id: request.params.id })
        .then(sauce => response.status(200).json(sauce))
        .catch(error => response.status(404).json({ error }));
}

exports.getAllSauces = (request, response, next) => {
    Sauces.find()
        .then(sauces => response.status(200).json(sauces))
        .catch(error => response.status(404).json({ error }));
}

exports.likeSauce = (request, response, next) => {

}