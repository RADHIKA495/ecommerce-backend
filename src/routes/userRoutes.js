const express = require("express");

const router = express.Router();

const { registerUser, loginUser, getProfile, logoutUser } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/logout", logoutUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "Welcome to profile",
        user: req.user
    });
});
router.get("/profile", authMiddleware, getProfile);
module.exports = router;