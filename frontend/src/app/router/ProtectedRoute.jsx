
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ allowedRoles }) {
    const {
        user,
        isAuthenticated,
        sessionChecked,
    } = useSelector((state) => state.auth);

    const location = useLocation();

    // Wait until the saved session has been checked.
    if (!sessionChecked) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-600 dark:text-gray-300">
                    Checking your session...
                </p>
            </div>
        );
    }

    // Redirect visitors without a valid authenticated profile.
    if (!isAuthenticated || !user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Check the user's role when the route requires one.
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // Access is allowed; render the matching nested route.
    return <Outlet />;
}

export default ProtectedRoute;
