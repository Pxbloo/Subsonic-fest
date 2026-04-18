import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, authReady, allowedRoles, children }) {
    // Loading
    if (!authReady) {
        return null;
    }

    // No session
    if (!user) {
        console.log("No user session. Redirecting to home...")
        return <Navigate to="/" replace />;
    }

    // Has session, but wrong role
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        console.log("User doesn't have enough permissions! Redirecting to home...")
        console.log("User role: ", user.role);
        return <Navigate to="/" replace />;
    }

    return children;
}