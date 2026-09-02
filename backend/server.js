import app from "./src/app.js";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDb();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();