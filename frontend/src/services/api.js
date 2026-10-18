// Import Axios for making HTTP requests.
import axios from "axios";

// Create a reusable Axios instance for TinyNest API requests.
const api = axios.create({
    // Backend API base URL.
    baseURL: "http://localhost:3000/api",

    // Allow the browser to send the HttpOnly refresh-token cookie.
    withCredentials: true,
});

// Store one refresh request so multiple failed requests
// can share it instead of refreshing at the same time.
let refreshPromise = null;

// Add the saved access token to outgoing API requests.
api.interceptors.request.use(
    (config) => {
        // Read the current JWT from localStorage.
        const token = localStorage.getItem("token");

        // Attach the token when it exists.
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Handle expired access tokens automatically.
api.interceptors.response.use(
    // Return successful responses unchanged.
    (response) => response,

    async (error) => {
        // Get the failed request configuration.
        const originalRequest = error.config;

        // Stop if there is no request configuration or the
        // server returned something other than 401.
        if (!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Do not try refreshing for login, registration, or
        // refresh requests themselves.
        const excludedUrls = [
            "/auth/login",
            "/auth/register",
            "/auth/refresh",
        ];

        const isExcludedUrl = excludedUrls.some((url) =>
            originalRequest.url?.includes(url)
        );

        if (isExcludedUrl) {
            return Promise.reject(error);
        }

        // Retry a failed request no more than once.
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // Avoid refreshing when no access token was attached.
        const hadAccessToken =
            Boolean(originalRequest.headers?.Authorization) ||
            Boolean(localStorage.getItem("token"));

        if (!hadAccessToken) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            // Share one refresh request across concurrent 401s.
            if (!refreshPromise) {
                refreshPromise = api
                    .post("/auth/refresh")
                    .then((response) => {
                        // Read the new JWT from the standard API response.
                        const newToken = response.data.data.token;

                        if (!newToken) {
                            throw new Error(
                                "Refresh response did not contain an access token."
                            );
                        }

                        // Save the renewed access token.
                        localStorage.setItem("token", newToken);

                        return newToken;
                    })
                    .finally(() => {
                        // Allow another refresh when needed later.
                        refreshPromise = null;
                    });
            }

            // Wait for the shared refresh request to finish.
            const newToken = await refreshPromise;

            // Attach the renewed token to the original request.
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            // Retry the original API request.
            return api(originalRequest);
        } catch (refreshError) {
            // Remove the expired access token.
            localStorage.removeItem("token");

            // Notify App.jsx to clear the Redux authentication state.
            window.dispatchEvent(
                new Event("tinynest:session-expired")
            );

            return Promise.reject(refreshError);
        }
    }
);

// Export the configured Axios instance.
export default api;
