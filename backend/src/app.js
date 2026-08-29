import express from "express";
import cors from 'cors'
import errorHandler from "./middleware/error.middleware.js";
import router from "./modules/auth/auth.routes.js";
import logger from "./middleware/logger.middleware.js";

const app = express();

app.use(express.json());
app.use(cors())
app.use(logger);


// Temporary test route
app.get("/", (req, res) => {
    res.send("tinynest API is running successfully");
});

// auth routes
app.use("/api/auth", router);

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