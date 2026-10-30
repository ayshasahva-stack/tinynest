import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/error.middleware.js";
import logger from "./middleware/logger.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/products/product.routes.js"
import categoryRoutes from "./modules/categories/category.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import wishlistRoutes from "./modules/wishlist/wishlist.routes.js";
import orderRoutes from "./modules/orders/order.routes.js";
import addressRoutes from "./modules/addresses/address.routes.js";
import reviewRoutes from "./modules/reviews/review.routes.js";
import couponRoutes from "./modules/coupons/coupon.routes.js";
import paymentRoutes from "./modules/payments/payment.routes.js";
import orderTrackingRoutes from "./modules/orderTracking/orderTracking.routes.js";
import offerRoutes from "./modules/offers/offer.routes.js";
import refundRoutes from "./modules/refund/refund.routes.js";
import adminDashboardRoutes from "./modules/adminDashboard/adminDashboard.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import kitRoutes from "./modules/kits/kit.routes.js";
import notificationRoutes from "./modules/notifications/notification.routes.js";


const app = express();
// Read the allowed frontend URLs from environment variables.
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
].filter(Boolean);

// Allow requests from local and deployed TinyNest frontends.
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Parse JSON request bodies.
app.use(express.json());

// Make cookies available through req.cookies.
app.use(cookieParser());

// Log incoming requests.
app.use(logger);


// Temporary test route
app.get("/", (req, res) => {
    res.send("tinynest API is running successfully");
});

// auth routes
app.use("/api/auth", authRoutes);
// Product API routes
app.use("/api/products", productRoutes);
// Category API routes
app.use("/api/categories", categoryRoutes);
// Cart api routes
app.use("/api/cart", cartRoutes);
// wishlist api routes
app.use("/api/wishlist", wishlistRoutes);
// order api route
app.use("/api/orders", orderRoutes);
// address api routes
app.use("/api/addresses", addressRoutes);
// review api routes
app.use("/api/reviews", reviewRoutes);
// coupons api routes
app.use("/api/coupons", couponRoutes);
// payment api routes
app.use("/api/payments", paymentRoutes);
// orderTracking api routes
app.use("/api/order-tracking", orderTrackingRoutes);
// offers api routed=s
app.use("/api/offers", offerRoutes);
// refund api routes
app.use("/api/refunds", refundRoutes);
// adminDashboard routes
app.use("/api/admin/dashboard", adminDashboardRoutes);
// usermanagment api routes
app.use("/api/users", userRoutes);
// kit api routes
app.use("/api/kits", kitRoutes);
// Notification API routes
app.use("/api/notifications", notificationRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "not found"
    })
})

// error handler
app.use(errorHandler)

export default app;