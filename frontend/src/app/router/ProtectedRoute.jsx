import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ allowedRoles }) {

    const { user, isAuthenticated, sessionChecked, } = useSelector((state) => state.auth);

    const location = useLocation();

    if (!sessionChecked) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-600 dark:text-gray-300">
                    Checking your session...
                </p>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
