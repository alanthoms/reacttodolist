import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "./Logout";

export function NavBar() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/shop") {
      document.body.classList.remove("gradient-backward");
      document.body.classList.add("gradient-forward");
    } else if (location.pathname === "/") {
      document.body.classList.remove("gradient-forward");
      document.body.classList.add("gradient-backward");
    }
  }, [location]);

  return (
    <div className="nav-bar">
      <h1>To Do List</h1>
      <Link to="/" className="home-title">
        <button className="holographic-card">Home</button>
      </Link>
      <Link to="/shop">
        <button className="holographic-card">Shop</button>
      </Link>
      <button onClick={logout} className="holographic-card">
        Logout
      </button>
    </div>
  );
}
