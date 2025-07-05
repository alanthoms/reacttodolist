import { NavBar } from "./components/NavBar";
import { Outlet } from "react-router-dom";

//first render navbar
//outlet tag is some parent route of all other routes
export function Layout(){
    return(
        <>
        <NavBar/>
            <main>
            <Outlet/>
        </main>
        </>
    )
}