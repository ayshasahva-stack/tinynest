
import { createSlice } from "@reduxjs/toolkit";

import {
    requestRefundThunk,
    getMyRefundsThunk,
    getAllRefundsThunk,
    updateRefundStatusThunk,
    processRefundThunk,
    completeRefundThunk,
} from "./refundThunk";

// Extract data from the common API response format.
const getResponseData = (payload) => payload?.data ?? payload;

// Update one refund in a list without changing other records.
const updateRefundInList = (refunds, updatedRefund) => {
    if (!updatedRefund?._id) return refunds;

    return refunds.map((refund) =>
        refund._id === updatedRefund._id ? updatedRefund : refund
    );
};

// Update a refund in both customer and admin lists if it exists.
const syncRefundLists = (state, refund) => {
    if (!refund?._id) return;

    // Keep the admin list synchronized.
    state.refunds = updateRefundInList(state.refunds, refund);

    // Keep the customer's refund history synchronized.
    state.myRefunds = updateRefundInList(state.myRefunds, refund);
};

// Initial state for the refund feature.
const initialState = {
    // Customer's own refund history.
    myRefunds: [],

    // All refund requests displayed to the admin.
    refunds: [],

    // The latest refund returned by an action.
    currentRefund: null,

    // Loading state for fetching refund lists.
    loading: false,

    // Loading state for refund actions.
    actionLoading: false,

    // Error while fetching refund lists.
    error: null,

    // Error while performing a refund action.
    actionError: null,

    // Latest success message.
    successMessage: null,
};

const refundSlice = createSlice({
    name: "refunds",
    initialState,

    reducers: {
        // Clear previous error and success messages.
        clearRefundFeedback: (state) => {
            state.error = null;
            state.actionError = null;
            state.successMessage = null;
        },

        // Clear the currently selected refund.
        clearCurrentRefund: (state) => {
            state.currentRefund = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // ----------------------------------------
            // Customer: request a refund.
            // ----------------------------------------
            .addCase(requestRefundThunk.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.successMessage = null;
            })
            .addCase(requestRefundThunk.fulfilled, (state, action) => {
                state.actionLoading = false;

                const refund = getResponseData(action.payload);

                state.currentRefund = refund;

                // Add the new refund to the customer's history.
                if (refund?._id) {
                    state.myRefunds = [
                        refund,
                        ...state.myRefunds.filter(
                            (item) => item._id !== refund._id
                        ),
                    ];
                }

                state.successMessage =
                    action.payload?.message || "Refund request submitted";
            })
            .addCase(requestRefundThunk.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError =
                    action.payload || "Failed to request refund";
            })

            // ----------------------------------------
            // Customer: fetch personal refund history.
            // ----------------------------------------
            .addCase(getMyRefundsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyRefundsThunk.fulfilled, (state, action) => {
                state.loading = false;

                const data = getResponseData(action.payload);

                // Keep customer history separate from the admin list.
                state.myRefunds = Array.isArray(data) ? data : [];
            })
            .addCase(getMyRefundsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Failed to fetch your refunds";
            })

            // ----------------------------------------
            // Admin: fetch all refund requests.
            // ----------------------------------------
            .addCase(getAllRefundsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllRefundsThunk.fulfilled, (state, action) => {
                state.loading = false;

                const data = getResponseData(action.payload);

                // Support an array or an object containing a refunds array.
                state.refunds = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.refunds)
                        ? data.refunds
                        : [];
            })
            .addCase(getAllRefundsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Failed to fetch refunds";
            })

            // ----------------------------------------
            // Admin: approve or reject a refund.
            // ----------------------------------------
            .addCase(updateRefundStatusThunk.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.successMessage = null;
            })
            .addCase(updateRefundStatusThunk.fulfilled, (state, action) => {
                state.actionLoading = false;

                const refund = getResponseData(action.payload);

                if (refund?._id) {
                    syncRefundLists(state, refund);
                    state.currentRefund = refund;
                }

                state.successMessage =
                    action.payload?.message || "Refund status updated";
            })
            .addCase(updateRefundStatusThunk.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError =
                    action.payload || "Failed to update refund status";
            })

            // ----------------------------------------
            // Admin: move an approved refund to processing.
            // ----------------------------------------
            .addCase(processRefundThunk.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.successMessage = null;
            })
            .addCase(processRefundThunk.fulfilled, (state, action) => {
                state.actionLoading = false;

                const refund = getResponseData(action.payload);

                if (refund?._id) {
                    syncRefundLists(state, refund);
                    state.currentRefund = refund;
                }

                state.successMessage =
                    action.payload?.message || "Refund processing started";
            })
            .addCase(processRefundThunk.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError =
                    action.payload || "Failed to process refund";
            })

            // ----------------------------------------
            // Admin: complete a refund in processing.
            // ----------------------------------------
            .addCase(completeRefundThunk.pending, (state) => {
                state.actionLoading = true;
                state.actionError = null;
                state.successMessage = null;
            })
            .addCase(completeRefundThunk.fulfilled, (state, action) => {
                state.actionLoading = false;

                const refund = getResponseData(action.payload);

                if (refund?._id) {
                    syncRefundLists(state, refund);
                    state.currentRefund = refund;
                }

                state.successMessage =
                    action.payload?.message || "Refund marked as completed";
            })
            .addCase(completeRefundThunk.rejected, (state, action) => {
                state.actionLoading = false;
                state.actionError =
                    action.payload || "Failed to complete refund";
            });
    },
});

export const {
    clearRefundFeedback,
    clearCurrentRefund,
} = refundSlice.actions;

export default refundSlice.reducer;
