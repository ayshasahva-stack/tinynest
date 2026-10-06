import { createSlice } from "@reduxjs/toolkit";

import {
    getMyAddressesThunk,
    getMyAddressByIdThunk,
    createAddressThunk,
    updateAddressThunk,
    deleteAddressThunk,
    setDefaultAddressThunk,
} from "./addressThunk";

const initialState = {
    addresses: [],
    selectedAddress: null,
    loading: false,
    error: null,
};

const addressSlice = createSlice({
    name: "addresses",

    initialState,

    reducers: {
        // Clear the currently selected address
        clearSelectedAddress: (state) => {
            state.selectedAddress = null;
        },

        // Clear address error
        clearAddressError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        // -----------------------------
        // GET ALL ADDRESSES
        // -----------------------------
        builder
            .addCase(getMyAddressesThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getMyAddressesThunk.fulfilled, (state, action) => {
                state.loading = false;

                state.addresses =
                    action.payload.data || [];
            })

            .addCase(getMyAddressesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // -----------------------------
        // GET ONE ADDRESS
        // -----------------------------
        builder
            .addCase(getMyAddressByIdThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getMyAddressByIdThunk.fulfilled, (state, action) => {
                state.loading = false;

                state.selectedAddress =
                    action.payload.data;
            })

            .addCase(getMyAddressByIdThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // -----------------------------
        // CREATE ADDRESS
        // -----------------------------
        builder
            .addCase(createAddressThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createAddressThunk.fulfilled, (state, action) => {
                state.loading = false;

                const newAddress = action.payload.data;

                // Add the newly created address
                state.addresses.push(newAddress);

                // If backend created it as default,
                // remove default status from other addresses
                if (newAddress?.isDefault) {
                    state.addresses = state.addresses.map(
                        (address) => ({
                            ...address,
                            isDefault:
                                address._id === newAddress._id,
                        })
                    );
                }
            })

            .addCase(createAddressThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // -----------------------------
        // UPDATE ADDRESS
        // -----------------------------
        builder
            .addCase(updateAddressThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(updateAddressThunk.fulfilled, (state, action) => {
                state.loading = false;

                const updatedAddress = action.payload.data;

                state.addresses = state.addresses.map(
                    (address) =>
                        address._id === updatedAddress._id
                            ? updatedAddress
                            : address
                );

                // If updated address became default,
                // remove default from other addresses
                if (updatedAddress?.isDefault) {
                    state.addresses = state.addresses.map(
                        (address) => ({
                            ...address,
                            isDefault:
                                address._id === updatedAddress._id,
                        })
                    );
                }
            })

            .addCase(updateAddressThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // -----------------------------
        // DELETE ADDRESS
        // -----------------------------
        builder
            .addCase(deleteAddressThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteAddressThunk.fulfilled, (state, action) => {
                state.loading = false;

                // The delete API returns null as data,
                // so we remove the address locally by ID.
                // The thunk payload does not contain the ID,
                // therefore the component will normally
                // refresh the address list after deletion.
            })

            .addCase(deleteAddressThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // -----------------------------
        // SET DEFAULT ADDRESS
        // -----------------------------
        builder
            .addCase(setDefaultAddressThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(setDefaultAddressThunk.fulfilled, (state, action) => {
                state.loading = false;

                const defaultAddress = action.payload.data;

                // Only the returned address should be default
                state.addresses = state.addresses.map(
                    (address) => ({
                        ...address,
                        isDefault:
                            address._id === defaultAddress._id,
                    })
                );
            })

            .addCase(setDefaultAddressThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearSelectedAddress,
    clearAddressError,
} = addressSlice.actions;

export default addressSlice.reducer;