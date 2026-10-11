
import api from "../../services/api";

// Ask the backend to create a Razorpay order for a TinyNest order.
export const createRazorpayOrder = async (orderId) => {
    const response = await api.post(`/payments/razorpay/${orderId}`);
    return response.data;
};

// Send Razorpay's returned payment details to the backend for verification.
export const verifyRazorpayPayment = async (paymentData) => {
    const response = await api.post(
        "/payments/razorpay/verify",
        paymentData
    );

    return response.data;
};

// Create a payment record for a supported payment method such as COD.
export const createPayment = async (orderId, paymentData) => {
    const response = await api.post(
        `/payments/${orderId}`,
        paymentData
    );

    return response.data;
};
