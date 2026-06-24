const Cart = require("../models/cart");
const Product = require("../models/productModel");

const addToCart = async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        let cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [{
                    product: productId, quantity: 1
                }]
            });
        }
        else {
            const itemIndex = cart.items.findIndex(item => item.product.toString() == productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += 1;
            }
            else {
                if (product.stock === 0) {
                    return res.status(400).send("Out Of Stock");
                }
                cart.items.push({
                    product: productId,
                    quantity: 1
                });
            }

            await cart.save();

        }

        res.redirect("/products-page");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const viewCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product");

        if (!cart) {
            return res.render("cart", { cartItems: [], totalPrice: 0 });
        }

        let totalPrice = 0;

        cart.items.forEach(item => {
            totalPrice += item.product.price * item.quantity;
        });

        res.render("cart", {
            cartItems: cart.items,
            totalPrice
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const increaseQuantity = async (req, res) => {
    try {
        const productId = req.params.productId;

        const cart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product");

        const item = cart.items.find(item =>
            item.product.toString() === productId
        );

        if (item.quantity >= item.product.stock) {
            return res.status(400).send("Not enough stock");
        }

        if (item) {
            item.quantity += 1;
        }

        await cart.save();

        res.redirect("/cart");
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const decreaseQuantity = async (req, res) => {

    try {

        const productId = req.params.productId;

        const cart = await Cart.findOne({
            user: req.user.id
        });

        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {

            if (cart.items[itemIndex].quantity > 1) {

                cart.items[itemIndex].quantity -= 1;

            } else {

                cart.items.splice(itemIndex, 1);

            }
        }

        await cart.save();

        res.redirect("/cart");

    }

    catch (error) {
        res.status(500).send(error.message);
    }

};

const removeItem = async (req, res) => {

    try {

        const productId = req.params.productId;

        const cart = await Cart.findOne({
            user: req.user.id
        });

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        res.redirect("/cart");

    }

    catch (error) {
        res.status(500).send(error.message);
    }

};

module.exports = { addToCart, viewCart, increaseQuantity, decreaseQuantity, removeItem };