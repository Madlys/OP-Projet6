const express = require("express");
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');

router.post("/", auth, multer, saucesCtrl.createSauce);
router.get("/", auth, saucesCtrl.getAllSauces);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likeSauce);

module.exports = router;