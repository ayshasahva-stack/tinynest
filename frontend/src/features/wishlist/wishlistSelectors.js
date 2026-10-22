
export const selectWishlistProducts = (state) =>
    state.wishlist.products;

export const selectWishlistKits = (state) =>
    state.wishlist.kits;

export const selectWishlistLoading = (state) =>
    state.wishlist.loading;

export const selectWishlistError = (state) =>
    state.wishlist.error;

export const selectWishlistCount = (state) =>
    state.wishlist.products.length + state.wishlist.kits.length;
