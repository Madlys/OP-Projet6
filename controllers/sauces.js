const Sauces = require('../models/Sauces');
const fs = require('fs');

exports.createSauce = (request, response, next) => {
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
        .catch(error => {
            fs.unlink(`images/${sauce.imageUrl.split('/images/')[1]}`, error => {
                if (error) {
                    console.log(error)
                } else {
                    console.log("Pas d'image ajoutée")
                }
            })
            response.status(400).json({ error })
        })

}

exports.modifySauce = (request, response, next) => {
    let tempSauceObject = null;
    //if image
    if (request.file) {
        if (request.body.sauce) {
            tempSauceObject = {
                ...JSON.parse(request.body.sauce),
                imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
            }
        }
        else {
            tempSauceObject = {
                imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`
            }
        }
    }
    // if only text
    else {
        tempSauceObject = { ...request.body };
    }

    const sauceObject = tempSauceObject;
    delete tempSauceObject;
    // delete sauceObject._userId;
    Sauces.findOne({ _id: request.params.id })
        .then((sauce) => {
            //If the id is not reconized
            if (sauce.userId != request.auth.userId) {
                response.status(403).json({ message: "Modification non autorisée" });
            } else {
                Sauces.updateOne({ _id: request.params.id }, { ...sauceObject, _id: request.params.id })
                    .then(() => {
                        // remove the old image if replaced during modification
                        if (request.file) {
                            fs.unlink(`images/${sauce.imageUrl.split('/images/')[1]}`, error => {
                                if (error) {
                                    console.log(error)
                                } else {
                                    console.log("image remplacée")
                                }
                            })
                        }
                        response.status(200).json({ message: "Sauce modifiée!" })
                    })
                    .catch(error => response.status(500).json({ error }));
            }
        })
        .catch((error) => {
            if (request.file) {
                fs.unlink(request.file.path, error => {
                    if (error) {
                        console.log(error)
                    } else {
                        console.log("Pas d'image ajoutée")
                    }
                })
            }
            response.status(400).json({ error })
        });
}

exports.deleteSauce = (request, response, next) => {
    Sauces.findOne({ _id: request.params.id })
        .then((sauce => {
            if (sauce.userId != request.auth.userId) {
                response.status(403).json({ message: "Suppression non autorisée" });
            } else {
                // filname retrieval in URL
                const filename = sauce.imageUrl.split('/images/')[1];
                //deleting sauce datas with deleteOne
                Sauces.deleteOne({ _id: request.params.id })
                    .then(() => {
                        // deleting sauce image with unlink
                        fs.unlink(`images/${filename}`, error => {
                            if (error) {
                                console.log(error)
                            } else {
                                console.log("image supprimée")
                            }
                        })
                        response.status(200).json({ message: "Sauce supprimée!" })
                    })
                    .catch(error => response.status(500).json({ error }))
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
    /* NOTE POSTMAN: envoi de la requête en body->raw format JSON
    avec les propriétés "userId" et "like" */

    // Get object in data base
    Sauces.findOne({ _id: request.params.id })
        .then((object) => {
            // switch case
            const likeStatus = {
                $inc: {},
                $push: {},
                $pull: {}
            };
            let successMessage;
            switch (request.body.like) {
                case 1:// request like = 1 (like = +1): if a user never liked and likes
                    if (!object.usersLiked.includes(request.body.userId)) {
                        // if the user had disliked, at first, delete the dislike (dislike -1)
                        if (object.dislikes == 1) {
                            likeStatus.$inc.dislikes = -1;
                            likeStatus.$pull.usersDisliked = request.body.userId;
                        }
                        //then update the data base (like +1)
                        likeStatus.$inc.likes = 1;
                        likeStatus.$push.usersLiked = request.body.userId;
                        //sucess message adaptation
                        successMessage = "like +1";
                    };
                    break;

                case -1://request like = -1 (dislike = +1): if a user never disliked and dislikes
                    if (!object.usersDisliked.includes(request.body.userId)) {
                        // if the user had liked, at first, delete the like (like -1)
                        if (object.likes == 1) {
                            likeStatus.$inc.likes = -1;
                            likeStatus.$pull.usersLiked = request.body.userId;
                        }
                        // then update the data base (dislike +1)
                        likeStatus.$inc.dislikes = 1;
                        likeStatus.$push.usersDisliked = request.body.userId;
                        //sucess message adaptation
                        successMessage = "dislike +1";
                    };
                    break;

                case 0://request like = 0, no vote
                    // like = 0: if a user has already liked and removes their like
                    if (object.usersLiked.includes(request.body.userId)) {
                        // data base update
                        likeStatus.$inc.likes = -1;
                        likeStatus.$pull.usersLiked = request.body.userId;
                        //sucess message adaptation
                        successMessage = "like -1";
                    }

                    // dislike = 0: if a user has already disliked and removes their dislike
                    if (object.usersDisliked.includes(request.body.userId)) {
                        // data base update
                        likeStatus.$inc.dislikes = -1;
                        likeStatus.$pull.usersDisliked = request.body.userId;
                        //sucess message adaptation
                        successMessage = "dislike -1";
                    };
            }
            Sauces.updateOne(
                { _id: request.params.id },
                // update like object status
                likeStatus
            )
                .then(() => response.status(201).json({ message: successMessage }))
                .catch((error) => request.status(400).json({ error }));
        })
        .catch((error) => request.status(404).json({ error }));
}