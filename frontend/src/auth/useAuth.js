import { useAuthContext } from "./AuthProvider";

const useAuth = () => {
  const { user, setUser, accessToken, setAccessToken, login, logout, refreshAccessToken } = useAuthContext();

  return {
    user,
    setUser,
    accessToken,
    setAccessToken,
    login,
    logout,
    refreshAccessToken,
    isAuthenticated: !!accessToken,
  };
};

export default useAuth;
