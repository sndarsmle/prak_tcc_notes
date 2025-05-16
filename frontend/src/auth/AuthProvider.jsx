import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axiosInstance";
import Cookies from "js-cookie";
import { BASE_URL } from "../utils/utils";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${BASE_URL}/login`, { email, password }, {
        withCredentials: true,
      });
      setAccessToken(res.data.accessToken);
      setUser(res.data.data);
      Cookies.set("refreshToken", res.data.refreshToken, {
        secure: true,
        sameSite: "Strict",
        expires: 5,
      });
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.delete(`${BASE_URL}/logout`, { withCredentials: true });
    } catch (e) {
      console.warn("Logout warning:", e);
    }
    setAccessToken(null);
    setUser(null);
    Cookies.remove("refreshToken");
  };

  const refreshAccessToken = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/refresh-token`, {}, { withCredentials: true });
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    } catch (err) {
      console.error("Token refresh failed:", err);
      logout();
      return null;
    }
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuthContext = () => useContext(AuthContext);
