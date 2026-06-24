const express = require("express");
const path = require("path"); // helps us to work with files and folders safely
const app = express(); // this will create the server
const cookieParser = require("cookie-parser");


app.use(express.json()); // translate JSON into JS objects

app.use(express.urlencoded({ extended: true })); // translate form language into js object
app.use(cookieParser());
app.set("view engine", "ejs"); // will tell express to use ejs templating on being rendered

app.set("views", path.join(__dirname, "views")); // tells express that ejs files are inside views folder

const methodOverride = require("method-override");
app.use(methodOverride('__method')); //  will convert post and get requests into delete or put or patch requests as requested

const orderRoutes = require("./routes/orderRoutes");
app.use("/", orderRoutes);

const productRoutes = require("./routes/productRouter");
app.use("/products", productRoutes); // telling express that use every route present in here

const userRoutes = require("./routes/userRoutes");
app.use("/api/auth", userRoutes);

const Product = require("./models/productModel");

const cartRoutes = require("./routes/cartRoutes");
app.use("/cart", cartRoutes);


app.get("/products-page", async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";
        const products = await Product.find({
            productName: {
                $regex: search, // pattern match 
                $options: "i" // case insensitive
            }
        }).populate("user", "name email").skip(skip).limit(limit);

        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);


        let isLoggedIn = false;

        if (req.cookies.token) {
            isLoggedIn = true;
        }

        res.render("products", { products, currentPage: page, totalPages, isLoggedIn });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/", async (req, res) => {
    try {
        let isLoggedIn = false;
        let user = null;

        if (req.cookies.token) {
            isLoggedIn = true;
        }

        res.render("home", {
            isLoggedIn,
            user
        });

    } catch (error) {
        res.status(500).send("Server Error");
    }
});


app.get("/add-product", (req, res) => {

    res.render("addProduct");

});

app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/login", (req, res) => {
    res.render("login");
})

module.exports = app;