import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useSearch from '../Hooks/SearchContext.hook';

export default function CallProtectedRoute() {
  const { isCallActive } = useSearch();
  const location = useLocation();

  // If there's no active call, redirect to home
  // This prevents rendering call UI when navigating back after call ends
  if (!isCallActive) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // If there's an active call, render the child routes
  return <Outlet />;
}
