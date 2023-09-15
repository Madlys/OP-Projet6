const mongoose = require("mongoose");

const SaucesSchema = mongoose.Schema({
    //unique MongoDB identifier of the user who created the sauce
    userId: { type: String, required: true },
    //sauce name
    name: { type: String, required: true },
    // sauce manufacturer
    manufacturer: { type: String },
    // sauce description
    description: { type: String },
    // the sauce's main spicy ingredient
    mainPepper: { type: String },
    // URL of sauce image downloaded by user
    imageUrl: { type: String, required: true },
    // number between 1 and 10 describing the sauce
    heat: { type: Number },
    // number of users who like the sauce
    likes: { type: Number },
    // number of users who don't like the sauce
    dislikes: { type: Number },
    // array of user IDs who liked the sauce
    usersLiked: { type: Array },
    // array of user IDs who didn't like the sauce
    usersDisliked: { type: Array }
});

module.exports = mongoose.model("Sauces", SaucesSchema);