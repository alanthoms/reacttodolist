import { Link } from "react-router-dom"

export function NavBar(){
    return(
        <>
        <Link to="/" className = 'home-title'><button>Home</button></Link>
        <Link to="/Shop"><button>Shop</button></Link>
        </>
    )
}