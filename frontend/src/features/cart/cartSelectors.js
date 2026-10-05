// Select all cart items
export const selectCartItems = (state) =>
    state.cart.items;

// Select cart loading state
export const selectCartLoading = (state) =>
    state.cart.loading;

// Select cart error state
export const selectCartError = (state) =>
    state.cart.error;

// Calculate the number of items in the cart
export const selectCartItemCount = (state) =>
    state.cart.items.reduce(
        (total, item) => total + item.quantity,
        0
    );