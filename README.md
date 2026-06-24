# E-Commerce Backend

A full-featured REST API backend for an e-commerce platform built with Node.js, Express.js, MongoDB, and JWT Authentication. Deployed on Render with MongoDB Atlas.

🔗 **[Live Application](https://ecommerce-backend-e0r9.onrender.com/)**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT (HTTP-Only Cookies) |
| Templating | EJS |
| Deployment | Render |

---

## Features

- User Authentication & Authorization (Register, Login, Logout)
- JWT Authentication via HTTP-Only Cookies
- Product CRUD with Search & Pagination
- Shopping Cart (Add, Remove, Increase/Decrease Quantity)
- Order Management with Item-Level Status Tracking
- Seller Dashboard with Order Analytics
- Verified Purchase Reviews & Ratings
- Automatic Stock Management on Order Placement
- Seller-Based Access Control
- Automatic Seller Onboarding

---

## Project Structure

```
src/
├── app.js                  ← Express setup, middleware, base routes
├── server.js               ← Entry point
├── config/
│   └── db.js               ← MongoDB connection
├── models/
│   ├── users.js
│   ├── productModel.js
│   ├── order.js
│   ├── cart.js
│   └── review.js
├── controllers/
│   ├── userController.js
│   ├── productController.js
│   ├── orderController.js
│   └── cartController.js
├── routes/
│   ├── userRoutes.js
│   ├── productRouter.js
│   ├── orderRoutes.js
│   └── cartRoutes.js
├── middlewares/
│   ├── authMiddleware.js
│   └── loggerMiddleware.js
└── views/                  ← EJS templates
```

---

## API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT cookie |
| GET | `/api/auth/logout` | No | Clear JWT cookie |
| GET | `/api/auth/profile` | Yes | Get logged-in user profile |

### Product Routes — `/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/products` | No | Get all products |
| GET | `/products/:id` | No | Get single product |
| POST | `/products` | Yes | Create product (auto-assigns seller role) |
| PUT | `/products/:id` | Yes | Update product (seller only) |
| DELETE | `/products/:id` | Yes | Delete product (seller only) |
| GET | `/products/details/:id` | Yes | Get product with reviews |
| GET | `/products/my-products` | Yes | Get all products by logged-in seller |

### Review Routes — `/products`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/products/:productId/review` | Yes | Add review (verified purchase only) |
| POST | `/products/review/edit/:reviewId` | Yes | Update review |
| POST | `/products/review/delete/:reviewId` | Yes | Delete review |

### Cart Routes — `/cart`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/cart` | Yes | View cart |
| POST | `/cart/add/:productId` | Yes | Add item to cart |
| POST | `/cart/increase/:productId` | Yes | Increase item quantity |
| POST | `/cart/decrease/:productId` | Yes | Decrease item quantity |
| POST | `/cart/remove/:productId` | Yes | Remove item from cart |

### Order Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/place-order` | Yes | Place order from cart |
| GET | `/orders` | Yes | Get all orders for logged-in user |
| GET | `/seller/orders` | Yes | Get all orders for logged-in seller |
| GET | `/seller/dashboard` | Yes | Seller dashboard with order stats |
| POST | `/seller/orders/:orderId/items/:itemId/status` | Yes | Update individual item status |

---

## Key Design Decisions

### Item-Level Order Status
Instead of a single status per order, each order item has its own status (`Pending → Processing → Shipped → Delivered → Cancelled`). This allows multiple sellers within the same order to independently manage their items.

### Verified Purchase Reviews
Before creating a review, the system queries existing orders to confirm the user has purchased the product. This prevents fake reviews and ensures authenticity.

### Automatic Seller Onboarding
When a buyer creates their first product, their role is automatically upgraded to `seller` — no separate registration flow required. This reduces friction and administrative overhead.

### Stock Management
On order placement, the system first validates that all cart item quantities are within available stock, then atomically decrements stock for each item. Users also cannot increase cart quantity beyond available stock.

### Seller-Based Access Control
Each product stores a reference to its seller. Status updates on order items are restricted to the seller associated with that specific item, enforced in the controller layer.

---

## Environment Variables

Create a `.env` file in the root directory:

```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/RADHIKA495/ecommerce-backend.git

# Install dependencies
cd ecommerce-backend
npm install

# Set up environment variables
cp .env.example .env

# Run in development
npm run dev

# Run in production
npm start
```

---

## Future Improvements

- Razorpay Payment Integration
- Admin Dashboard
- Email Notifications
- Input Validation (express-validator)
- Unit & Integration Tests

---

## Author

Radhika
GitHub: [RADHIKA495](https://github.com/RADHIKA495)