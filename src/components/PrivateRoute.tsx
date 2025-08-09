import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
    return sessionStorage.getItem("google_token");
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated() ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;