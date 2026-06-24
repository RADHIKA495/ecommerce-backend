const Product = require("../models/productModel");
const Order = require("../models/order");
const Review = require("../models/review");
const User = require("../models/users");

const createReview = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { rating, comment } = req.body;

        const hasPurchased = await Order.findOne({
            user: req.user.id,
            "items.product": productId
        });

        if (!hasPurchased) {
            return res.status(403).send(
                "You can only review products you purchased"
            );
        }

        const existingReview = await Review.findOne({
            user: req.user.id,
            product: productId
        });

        if (existingReview) {
            return res.status(400).send("You already reviewed this product");
        }

        await Review.create({
            product: productId,
            user: req.user.id,
            rating,
            comment
        });

        const reviews = await Review.find({
            product: productId
        });

        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );

        const averageRating =
            totalRating / reviews.length;

        await Product.findByIdAndUpdate(
            productId,
            {
                averageRating,
                numReviews: reviews.length
            }
        );

        res.redirect(`/products/details/${productId}`);
    }
    catch (error) {
        res.status(500).send("Server Error");
    }
}

const getProductDetails = async (req, res) => {
    try {

        const product = await Product.findById(
            req.params.id
        ).populate(
            "user",
            "name email"
        );

        const reviews = await Review.find({
            product: req.params.id
        }).populate(
            "user",
            "name"
        );

        res.render(
            "product-details",
            {
                product,
                reviews,
                currentUserId: req.user.id
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

const getEditReviewPage = async (req, res) => {
    try {

        const review = await Review.findById(
            req.params.reviewId
        );

        if (!review) {
            return res.status(404).send(
                "Review not found"
            );
        }

        if (review.user.toString() !== req.user.id) {
            return res.status(403).send(
                "Not Authorized"
            );
        }

        res.render(
            "edit-review",
            { review }
        );

    } catch (error) {
        res.status(500).send(
            "Server Error"
        );
    }
};
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("user", "name email");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

const getSingleProduct = async (req, res) => {

    try {
        const productId = req.params.id;
        const foundProduct = await Product.findById(productId);

        if (!foundProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(foundProduct);
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

const createProduct = async (req, res) => {
    try {

        if (req.user.role !== "seller") {
            await User.findByIdAndUpdate(req.user.id, {
                role: "seller"
            });
        }

        const newProduct = new Product({
            productName: req.body.productName,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            user: req.user.id,
            stock: req.body.stock
        });

        await newProduct.save();

        res.redirect("/products-page");
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

const getEditProductPage = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);
        if (product.user.toString() !== req.user.id) {
            return res.status(403).send("Not Authorized");
        }
        res.render("edit-product", { product });
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

const getMyProductsPage = async (req, res) => {
    try {
        const products = await Product.find({
            user: req.user.id
        });

        res.render("my-products", { products });
    } catch (error) {
        res.status(505).send("Error loading Products");
    }
};

const deleteProductFromForm = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);

        if (!req.cookies.token || product.user.toString() !== req.user.id) {
            return res.status(403).send("Not Authorized");
        }

        await Product.findByIdAndDelete(req.params.id);
        res.redirect("/products-page");
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

const updateProductFromForm = async (req, res) => {
    try {
        const { productName, price, imageUrl, stock } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send("Product Not Found");
        }

        if (product.user.toString() !== req.user.id) {
            return res.status(403).send("Not Authorized");
        }

        await Product.findByIdAndUpdate(
            req.params.id,
            {
                productName,
                price,
                imageUrl,
                stock
            }
        );

        res.redirect("/products-page");
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;

        const updateProduct = await Product.findById(productId);

        if (!updateProduct) {
            return res.status(404).json({
                message: "Product Not found"
            });
        }

        if (updateProduct.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to update this product"
            });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            req.body,
            { new: true }
        );

        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }

};

const deleteReview = async (req, res) => {
    try {

        const review = await Review.findById(
            req.params.reviewId
        );

        if (!review) {
            return res.status(404).send(
                "Review not found"
            );
        }

        if (review.user.toString() !== req.user.id) {
            return res.status(403).send(
                "Not Authorized"
            );
        }

        const productId = review.product;

        await Review.findByIdAndDelete(
            req.params.reviewId
        );

        const reviews = await Review.find({
            product: productId
        });

        let averageRating = 0;

        if (reviews.length > 0) {

            const totalRating = reviews.reduce(
                (sum, review) =>
                    sum + review.rating,
                0
            );

            averageRating = Number(
                (totalRating / reviews.length)
                    .toFixed(1)
            );
        }

        await Product.findByIdAndUpdate(
            productId,
            {
                averageRating,
                numReviews: reviews.length
            }
        );

        res.redirect(
            `/products/details/${productId}`
        );

    } catch (error) {
        res.status(500).send(
            "Server Error"
        );
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deleteProduct = await Product.findById(productId);

        if (!deleteProduct) {
            return res.status(404).json({
                message: "Productnot found"
            });
        }

        if (deleteProduct.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to delete this product"
            });
        }

        const deletedProduct = await Product.findByIdAndDelete(productId);

        res.status(200).json({
            message: "Product deleted successfully",
            product: deleteProduct
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

const updateReview = async (req, res) => {
    try {

        const review = await Review.findById(
            req.params.reviewId
        );

        if (!review) {
            return res.status(404).send(
                "Review not found"
            );
        }

        if (review.user.toString() !== req.user.id) {
            return res.status(403).send(
                "Not Authorized"
            );
        }

        review.rating = req.body.rating;
        review.comment = req.body.comment;

        await review.save();

        const reviews = await Review.find({
            product: review.product
        });

        const totalRating = reviews.reduce(
            (sum, review) =>
                sum + review.rating,
            0
        );

        const averageRating = Number(
            (
                totalRating /
                reviews.length
            ).toFixed(1)
        );

        await Product.findByIdAndUpdate(
            review.product,
            {
                averageRating,
                numReviews: reviews.length
            }
        );

        res.redirect(
            `/products/details/${review.product}`
        );

    } catch (error) {
        res.status(500).send(
            "Server Error"
        );
    }
};

module.exports = { updateReview, getEditReviewPage, deleteReview, getMyProductsPage, deleteProductFromForm, updateProductFromForm, getEditProductPage, getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct, createReview, getProductDetails };
