// Import Redux Toolkit's store creator
import { configureStore } from "@reduxjs/toolkit";

// Import the products reducer
import productReducer from "../features/products/productSlice";
// Import the authentication reducer
import authReducer from "../features/auth/authSlice";

// Create the application's Redux store
const store = configureStore({
    reducer: {
        // Store all product-related state under "products"
        products: productReducer,
        auth:authReducer,
    },
});

// Export the configured Redux store
export default store;