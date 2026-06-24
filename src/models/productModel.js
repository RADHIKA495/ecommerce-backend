const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    productName: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: 3
    },

    imageUrl: {
        type: String
    },

    price: {
        type: Number,
        required: [true, "Price is required"],
        min: 0
    },

    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 1
    },

    averageRating: {
        type: Number,
        default: 0
    },

    numReviews: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    });

const Product = new mongoose.model("Product", productSchema);
module.exports = Product;

