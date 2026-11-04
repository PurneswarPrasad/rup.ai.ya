import { Navigate } from "react-router-dom";
import { getSessionUser } from "@/lib/auth";

const isAuthenticated = () => {
    return Boolean(getSessionUser());
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated() ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;