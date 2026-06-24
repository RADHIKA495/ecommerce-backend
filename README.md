# E-Commerce Backend

A full-featured E-Commerce Backend built with Node.js, Express.js, MongoDB, and JWT Authentication.
Deployed on Render with MongoDB Atlas for cloud database management.


## Live Demo

[Live Application](https://ecommerce-backend-e0r9.onrender.com/)

## Features

- User Authentication & Authorization
- JWT Authentication using HTTP-Only Cookies
- Product CRUD Operations
- Search & Pagination
- Shopping Cart
- Order Management
- Seller Dashboard
- Item-level Order Status Updates
- Reviews & Ratings
- Verified Purchase Reviews
- Stock Management
- MongoDB Atlas Integration
- Render Deployment

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- EJS
- Render

## Architecture

- MVC-based project structure
- Separate layers for routes, controllers, models, and middleware
- MongoDB Atlas cloud database
- JWT authentication with protected routes

## Key Design Decisions

### Item-Level Order Status
Instead of storing a single status for the entire order, each order item maintains its own status. This allows multiple sellers to independently manage products within the same order.

### Seller-Based Access Control
Each product stores its seller reference, and only the seller associated with an order item can update its status.

### Verified Purchase Reviews
Users can review a product only if they have previously purchased it, ensuring review authenticity.

### Stock Management
Product stock is automatically reduced when orders are placed, and users cannot add quantities exceeding available inventory.

### Automatic Seller Onboarding
A user automatically becomes a seller when creating their first product, simplifying seller management and reducing administrative overhead.


## Future Improvements

- Razorpay Integration
- Admin Dashboard
- Email Notifications

## Author

Radhika 

GitHub: https://github.com/RADHIKA495
