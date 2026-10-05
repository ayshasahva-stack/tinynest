// Select all wishlist products
export const selectWishlistProducts = (state) =>
    state.wishlist.products;

// Select wishlist loading state
export const selectWishlistLoading = (state) =>
    state.wishlist.loading;

// Select wishlist error
export const selectWishlistError = (state) =>
    state.wishlist.error;

// Select the number of wishlist products
export const selectWishlistCount = (state) =>
    state.wishlist.products.length;