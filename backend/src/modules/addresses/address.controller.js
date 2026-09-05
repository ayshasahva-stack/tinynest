import Address from "./address.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import { validateAddress,
    validateAddressUpdate,
 } from "./address.validation.js";

// Create a new address for the logged-in user
export const createAddress = async (req, res, next) => {
    try {
        // Validate the address data sent by the client
        const validationError = validateAddress(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Check whether the user wants this address to be the default
        const isDefault = req.body.isDefault === true;

        // If this address should be the default,
        // remove the default status from the user's existing addresses
        if (isDefault) {
            await Address.updateMany(
                { user: req.user._id, isDefault: true },
                { $set: { isDefault: false } }
            );
        }

        // Create the address and associate it with the logged-in user
        const address = await Address.create({
            ...req.body,
            user: req.user._id,
            isDefault
        });

        // Return the newly created address
        sendSuccessResponse(
            res,
            201,
            address,
            "Address created successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Get all addresses belonging to the logged-in user
export const getMyAddresses = async (req, res, next) => {
    try {
        // Find only the addresses owned by the authenticated user
        const addresses = await Address.find({
            user: req.user._id
        }).sort({
            isDefault: -1,
            createdAt: -1
        });

        // Return the user's addresses
        sendSuccessResponse(
            res,
            200,
            addresses,
            "Addresses fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Get one address belonging to the logged-in user
export const getMyAddressById = async (req, res, next) => {
    try {
        // Get the address ID from the URL
        const { addressId } = req.params;

        // Find the address and make sure it belongs to the logged-in user
        const address = await Address.findOne({
            _id: addressId,
            user: req.user._id
        });

        // If the address doesn't exist or belongs to another user
        if (!address) {
            return next(new ApiError(404, "Address not found"));
        }

        // Return the address
        sendSuccessResponse(
            res,
            200,
            address,
            "Address fetched successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Update an address belonging to the logged-in user
export const updateAddress = async (req, res, next) => {
    try {
        // Get the address ID from the URL
        const { addressId } = req.params;

        // Validate the update data
        const validationError = validateAddressUpdate(req.body);

        if (validationError) {
            return next(new ApiError(400, validationError));
        }

        // Find only the address belonging to the logged-in user
        const address = await Address.findOne({
            _id: addressId,
            user: req.user._id
        });

        if (!address) {
            return next(new ApiError(404, "Address not found"));
        }

        // If the address is being made the default,
        // remove default status from the user's other addresses
        if (req.body.isDefault === true) {
            await Address.updateMany(
                {
                    user: req.user._id,
                    _id: { $ne: addressId },
                    isDefault: true
                },
                {
                    $set: { isDefault: false }
                }
            );
        }

        // Update only the fields provided by the client
        Object.assign(address, req.body);

        // Save the updated address
        await address.save();

        // Return the updated address
        sendSuccessResponse(
            res,
            200,
            address,
            "Address updated successfully"
        );
    } catch (error) {
        next(error);
    }
};
// Delete an address belonging to the logged-in user
export const deleteAddress = async (req, res, next) => {
    try {
        const { addressId } = req.params;

        // Find the address and make sure it belongs to the logged-in user
        const address = await Address.findOne({
            _id: addressId,
            user: req.user._id
        });

        // Address not found or belongs to another user
        if (!address) {
            return next(new ApiError(404, "Address not found"));
        }

        // Delete the address
        await Address.findByIdAndDelete(addressId);

        return sendSuccessResponse(
            res,
            200,
            null,
            "Address deleted successfully"
        );
    } catch (error) {
        next(error);
    }
};