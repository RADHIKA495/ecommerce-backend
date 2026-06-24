const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
    getSellerDashboard,
    getSellerOrders,
    placeOrder,
    getOrders, updateOrderItemStatus
} = require("../controllers/orderController");

router.post(
    "/place-order",
    authMiddleware,
    placeOrder
);

router.get(
    "/seller/dashboard",
    authMiddleware,
    getSellerDashboard
);
router.post("/seller/orders/:orderId/items/:itemId/status", authMiddleware, updateOrderItemStatus);

router.get("/seller/orders", authMiddleware, getSellerOrders);

router.get(
    "/orders",
    authMiddleware,
    getOrders
);

module.exports = router;