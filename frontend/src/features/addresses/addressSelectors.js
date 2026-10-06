// Get all saved addresses
export const selectAddresses = (state) =>
    state.addresses.addresses;

// Get the currently selected address
export const selectSelectedAddress = (state) =>
    state.addresses.selectedAddress;

// Get loading state
export const selectAddressLoading = (state) =>
    state.addresses.loading;

// Get error state
export const selectAddressError = (state) =>
    state.addresses.error;

// Get the default address
export const selectDefaultAddress = (state) =>
    state.addresses.addresses.find(
        (address) => address.isDefault
    );