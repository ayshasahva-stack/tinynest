import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import productReducer from "../features/products/productSlice";
import categoryReducer from "../features/categories/categorySlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import checkoutReducer from "../features/checkout/checkoutSlice";
import orderReducer from "../features/orders/orderSlice";
import addressReducer from "../features/addresses/addressSlice";
import reviewReducer from "../features/reviews/reviewSlice";
import kitReducer from "../features/kits/kitSlice";
import couponReducer from "../features/coupons/couponSlice";
import adminReducer from "../features/admin/adminSlice";
import userReducer from "../features/users/userSlice";
import paymentReducer from "../features/payments/paymentSlice";
import refundReducer from "../features/refund/refundSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        categories: categoryReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        checkout: checkoutReducer,
        orders: orderReducer,
        addresses: addressReducer,
        reviews: reviewReducer,
        kits: kitReducer,
        coupons: couponReducer,
        admin: adminReducer,
        users: userReducer,
        payments: paymentReducer,
        refunds: refundReducer,
    },
});

export default store;