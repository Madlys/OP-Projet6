const express = require("express");
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const saucesController = require('../controllers/sauces');

router.post("/", auth, multer, saucesController.createSauce);
router.get("/", auth, saucesController.getAllSauces);
router.get("/:id", auth, saucesController.getOneSauce);
router.put("/:id", auth, multer, saucesController.modifySauce);
router.delete("/:id", auth, saucesController.deleteSauce);
router.post("/:id/like", auth, saucesController.likeSauce);

module.exports = router;