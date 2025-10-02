import { Link, useLocation } from "react-router-dom"
import { useEffect } from "react";

export function NavBar(){
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/Shop") {
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
            <Link to="/" className='home-title'><button>Home</button></Link>
            <Link to="/Shop"><button>Shop</button></Link>
        </div>
    )
}
