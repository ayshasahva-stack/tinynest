
import api from "../../services/api";

// Customer: request a refund for an eligible order.
// The backend expects the order ID in the URL and the reason in the body.
export const requestRefund = async (orderId, reason) => {
    const response = await api.post(`/refunds/${orderId}`, { reason });
    return response.data;
};

// Admin: fetch all refund requests.
export const getAllRefunds = async () => {
    const response = await api.get("/refunds/admin");
    return response.data;
};

// Admin: approve or reject a refund.
// decision should match the values expected by validateRefundDecision.
export const updateRefundStatus = async ({
    refundId,
    status,
    adminNote = "",
}) => {
    const response = await api.patch(`/refunds/${refundId}/status`, {
        status,
        adminNote,
    });

    return response.data;
};

// Admin: move an approved refund into processing.
export const processRefund = async (refundId) => {
    const response = await api.patch(`/refunds/${refundId}/process`);
    return response.data;
};

// Admin: complete a refund that is being processed.
export const completeRefund = async (refundId) => {
    const response = await api.patch(`/refunds/${refundId}/complete`);
    return response.data;
};
// Customer: fetch refund requests belonging to the logged-in user.
export const getMyRefunds = async () => {
    const response = await api.get("/refunds/my");
    return response.data;
};