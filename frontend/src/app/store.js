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
import wishlistReducer from "../features/wishlist/wishlistSlice";
import checkoutReducer from "../features/checkout/checkoutSlice";
import orderReducer from "../features/orders/orderSlice";
import addressReducer from "../features/addresses/addressSlice";
import reviewReducer from "../features/reviews/reviewSlice";
// Create the application's Redux store
const store = configureStore({
    reducer: {
        // Store all product-related state under "products"
        products: productReducer,
        auth: authReducer,
        categories: categoryReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        checkout: checkoutReducer,
        orders:orderReducer,
        addresses: addressReducer,
        reviews: reviewReducer,
    },
});

// Export the configured Redux store
export default store;