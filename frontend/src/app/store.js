// Import Redux Toolkit's store creator
import { configureStore } from "@reduxjs/toolkit";

// Import the products reducer
import productReducer from "../features/products/productSlice";
// Import the authentication reducer
import authReducer from "../features/auth/authSlice";
// Import the category reducer
import categoryReducer from "../features/categories/categorySlice";
// Import the cart reducer
import cartReducer from "../features/cart/cartSlice";

// Create the application's Redux store
const store = configureStore({
    reducer: {
        // Store all product-related state under "products"
        products: productReducer,
        auth: authReducer,
        categories: categoryReducer,
          cart: cartReducer,
    },
});

// Export the configured Redux store
export default store;