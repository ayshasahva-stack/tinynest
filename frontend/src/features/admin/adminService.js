// Import the configured Axios instance.
// This automatically adds the JWT token to requests.
import api from "../../services/api";

// Get admin dashboard overview statistics.
export const getDashboardOverview = async () => {
    // Call the backend admin dashboard overview endpoint.
    const response = await api.get("/admin/dashboard/overview");

    // Return the backend response.
    return response.data;
};