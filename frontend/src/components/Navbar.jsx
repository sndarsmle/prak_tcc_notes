import { useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import axios from "../api/axiosInstance";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
 
  return (
    <nav className="navbar is-light mb-5">
      <div className="navbar-brand">
        <a className="navbar-item has-text-weight-bold" href="/">
          📝 AKSARA APP
        </a>
      </div>
      <div className="navbar-end">
        {user && (
          <div className="navbar-item">
            <div className="buttons">
              <span className="mr-3">👤 {user.name}</span>
              <button onClick={handleLogout} className="button is-danger is-light">
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
