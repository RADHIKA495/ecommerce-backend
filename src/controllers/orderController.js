const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/productModel");

const placeOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.id
        }).populate({
            path: "items.product",
            populate: {
                path: "user"
            }
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).send("Cart is empty");
        }

        for (const item of cart.items) {

            if (item.quantity > item.product.stock) {

                return res.status(400).send(
                    `${item.product.productName} has only ${item.product.stock} items left`
                );

            }

        }

        let totalAmount = 0;

        const orderItems = cart.items.map(item => {
            totalAmount += item.product.price * item.quantity;

            return {
                product: item.product._id,
                productName: item.product.productName,
                price: item.product.price,
                quantity: item.quantity,
                seller: item.product.user.id,
                status: "Pending"
            };
        });

        await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount
        });

        for (const item of cart.items) {

            item.product.stock -= item.quantity;

            await item.product.save();

        }

        cart.items = [];

        await cart.save();

        res.redirect("/orders");
    } catch (error) {
        res.status(500).send("Server Error");
    }
};

const getOrders = async (req, res) => {
    try {

        const orders = await Order.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.render("myOrders", {
            orders
        });

    } catch (error) {
        res.status(500).send("Server Error");
    }
};

const getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email");

        let sellerOrders = [];

        orders.forEach(order => {
            order.items.forEach(item => {

                if (item.seller && item.seller.toString() === req.user.id) {

                    sellerOrders.push({
                        itemId: item._id,
                        orderId: order._id,
                        customer: order.user,
                        productName: item.productName,
                        quantity: item.quantity,
                        price: item.price,
                        status: item.status
                    });

                }
            });
        });

        res.render("sellerOrders", { sellerOrders });
    }
    catch (err) {
        res.status(500).send("Server Error");
    }
};

const updateOrderItemStatus = async (req, res) => {
    try {

        const { orderId, itemId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).send("Order not found");
        }

        const item = order.items.id(itemId);

        if (!item) {
            return res.status(404).send("Item not found");
        }

        if (item.seller.toString() !== req.user.id) {
            return res.status(403).send("Not Authorized");
        }

        item.status = status;

        await order.save();

        res.redirect("/seller/dashboard");

    } catch (error) {
        res.status(500).send("Server Error");
    }
};


const getSellerDashboard = async (req, res) => {
    try {

        const totalProducts = await Product.countDocuments({
            user: req.user.id
        });

        const orders = await Order.find();

        let totalOrders = 0;
        let pendingOrders = 0;
        let processingOrders = 0;
        let shippedOrders = 0;
        let deliveredOrders = 0;

        orders.forEach(order => {

            order.items.forEach(item => {

                if (item.seller && item.seller.toString() === req.user.id) {

                    totalOrders++;

                    if (item.status === "Pending")
                        pendingOrders++;

                    else if (item.status === "Processing")
                        processingOrders++;

                    else if (item.status === "Shipped")
                        shippedOrders++;

                    else if (item.status === "Delivered")
                        deliveredOrders++;
                }

            });

        });

        res.render("sellerDashboard", {
            totalProducts,
            totalOrders,
            pendingOrders,
            processingOrders,
            shippedOrders,
            deliveredOrders
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};

module.exports = { getSellerDashboard, placeOrder, getOrders, getSellerOrders, updateOrderItemStatus };