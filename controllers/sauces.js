const Sauces = require('./models/Sauces');

exports.createSauce = (req, res, next) => {
    const sauce = new Sauces({
        ...req.body
    });
    // ++Img ULR ???
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
        .catch(error => res.status(400).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    Sauces.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    Sauces.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée!' }))
        .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id }) //.id ou .userId??
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