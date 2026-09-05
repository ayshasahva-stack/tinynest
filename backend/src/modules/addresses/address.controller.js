import Address from "./address.model.js";
import ApiError from "../../utils/Apierror.js";
import sendSuccessResponse from "../../utils/ApiResponse.js";
import { validateAddress } from "./address.validation.js";

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