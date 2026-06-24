const express = require("express");

const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const loggerMiddleware = require("../middlewares/loggerMiddleware");
const {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProductFromForm,
    getEditProductPage,
    updateProductFromForm, getMyProductsPage,
    createReview, getProductDetails, deleteReview, getEditReviewPage, updateReview } = require("../controllers/productController");

router.get(
    "/review/edit/:reviewId",
    authMiddleware,
    getEditReviewPage
);

router.post(
    "/review/edit/:reviewId",
    authMiddleware,
    updateReview
);
router.post("/review/delete/:reviewId", authMiddleware, deleteReview);
router.get("/details/:id", authMiddleware, getProductDetails);
router.get("/my-products", authMiddleware, getMyProductsPage);
router.post("/:productId/review", authMiddleware, createReview);
router.get("/edit-product/:id", authMiddleware, getEditProductPage);
router.post("/edit-product/:id", authMiddleware, updateProductFromForm);
router.get("/", loggerMiddleware, getAllProducts);
router.get("/:id", getSingleProduct);
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.post("/delete-product/:id", authMiddleware, deleteProductFromForm);
module.exports = router;