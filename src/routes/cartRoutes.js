const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const { addToCart, viewCart, increaseQuantity, decreaseQuantity, removeItem } = require("../controllers/cartController");

router.post("/add/:productId", authMiddleware, addToCart);
router.get("/", authMiddleware, viewCart);
router.post(
    "/increase/:productId",
    authMiddleware,
    increaseQuantity
);

router.post(
    "/decrease/:productId",
    authMiddleware,
    decreaseQuantity
);

router.post(
    "/remove/:productId",
    authMiddleware,
    removeItem
);

module.exports = router;