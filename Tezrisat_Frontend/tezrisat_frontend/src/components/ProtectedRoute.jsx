import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../api";
import {REFRESH_TOKEN, ACCESS_TOKEN} from "../constants";
import {useEffect, useState} from "react";

/**
 * ProtectedRoute Component
 *
 * This component checks if the user is authorized based on the stored JWT.
 * If the token is expired, it attempts to refresh the access token.
 * If the user is not authorized, it redirects to the login page.
 *
 * @param {Object} props - Component properties.
 * @param {JSX.Element} props.children - The child components to render if authorized.
 * @returns {JSX.Element} The rendered children if authorized, otherwise a redirect to login.
 */
function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    // Run authentication check on mount.
    auth().catch(() => setIsAuthorized(false));
  }, []);

  /**
   * Refreshes the access token using the refresh token stored in localStorage.
   */
  const refreshToken = async () => {
    const refresh = localStorage.getItem(REFRESH_TOKEN);
    try {
      const response = await api.post("/api/token/refresh/", { refresh });
      // If the response status indicates success, update the access token.
      if (response.status !== 200) {
        const newAccessToken = response.data.access;
        localStorage.setItem(ACCESS_TOKEN, newAccessToken);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      setIsAuthorized(false);
    }
  };

  /**
   * Checks if the user is authenticated.
   * If the access token is missing or expired, attempts to refresh it.
   */
  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    // Decode the token to access the expiration time.
    const decoded = jwtDecode(token);
    const tokenExp = decoded.exp;
    const currentTime = Date.now() / 1000;
    if (tokenExp < currentTime) {
      // Token has expired; attempt to refresh.
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  // While authorization is being determined, show a loading indicator.
  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  // Render children if authorized, otherwise redirect to login.
  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
