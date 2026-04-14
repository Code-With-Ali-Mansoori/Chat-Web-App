import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthCheck } from "../Hooks/Profile.Hook";
import Loader from "./Loader";

const Protected_Route = () => {
  const location = useLocation();
  const { isLoading, isError, data } = useAuthCheck();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !data) {
    return <Navigate to="/user/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default Protected_Route;
