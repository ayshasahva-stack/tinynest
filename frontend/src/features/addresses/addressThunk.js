import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    createAddress,
    getMyAddresses,
    getMyAddressById,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} from "./addressService";

// Fetch all addresses
export const getMyAddressesThunk = createAsyncThunk(
    "addresses/getMyAddresses",
    async (_, { rejectWithValue }) => {
        try {
            return await getMyAddresses();
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch addresses"
            );
        }
    }
);

// Fetch one address
export const getMyAddressByIdThunk = createAsyncThunk(
    "addresses/getMyAddressById",
    async (addressId, { rejectWithValue }) => {
        try {
            return await getMyAddressById(addressId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch address"
            );
        }
    }
);

// Create a new address
export const createAddressThunk = createAsyncThunk(
    "addresses/createAddress",
    async (addressData, { rejectWithValue }) => {
        try {
            return await createAddress(addressData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to create address"
            );
        }
    }
);

// Update an existing address
export const updateAddressThunk = createAsyncThunk(
    "addresses/updateAddress",
    async ({ addressId, addressData }, { rejectWithValue }) => {
        try {
            return await updateAddress(addressId, addressData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update address"
            );
        }
    }
);

// Delete an address
export const deleteAddressThunk = createAsyncThunk(
    "addresses/deleteAddress",
    async (addressId, { rejectWithValue }) => {
        try {
            return await deleteAddress(addressId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete address"
            );
        }
    }
);

// Set an address as default
export const setDefaultAddressThunk = createAsyncThunk(
    "addresses/setDefaultAddress",
    async (addressId, { rejectWithValue }) => {
        try {
            return await setDefaultAddress(addressId);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to set default address"
            );
        }
    }
);