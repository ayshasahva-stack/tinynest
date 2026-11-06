import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api`,

    withCredentials: true,
});

let refreshPromise = null;

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error);
        }
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

        if (originalRequest._retry) {
            return Promise.reject(error);
        }
        const hadAccessToken =
            Boolean(originalRequest.headers?.Authorization) ||
            Boolean(localStorage.getItem("token"));

        if (!hadAccessToken) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            if (!refreshPromise) {
                refreshPromise = api
                    .post("/auth/refresh")
                    .then((response) => {
                        const newToken = response.data.data.token;

                        if (!newToken) {
                            throw new Error(
                                "Refresh response did not contain an access token."
                            );
                        }

                        localStorage.setItem("token", newToken);

                        return newToken;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const newToken = await refreshPromise;

            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            localStorage.removeItem("token");

            window.dispatchEvent(
                new Event("tinynest:session-expired")
            );

            return Promise.reject(refreshError);
        }
    }
);

export default api;
