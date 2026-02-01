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
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-2 flex items-center justify-between bg-white/10 backdrop-blur-lg border-b border-white/10 shadow-2xl">
      <div className="flex items-center gap-12">
        {/* LOGO */}
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white m-0 !p-0 leading-none">
          WANT TO DO
        </h1>

        {/* NAV LINKS */}
        <div className="flex gap-8 items-center">
          <Link
            to="/"
            className="group relative py-2 text-sm uppercase tracking-widest font-bold text-white no-underline font-4xl transition-colors hover:text-white"
          >
            TO DOS
            <span
              className={`absolute bottom-0 left-0 h-[2px] bg-[#ffffff] shadow-[0_0_8px_#7fffd4] transition-all duration-300 ${location.pathname === "/" ? "w-full" : "w-0 group-hover:w-full"}`}
            ></span>
          </Link>

          <Link
            to="/shop"
            className="group relative py-2 text-sm uppercase tracking-widest font-bold text-white no-underline transition-colors hover:text-white"
          >
            Wants
            <span
              className={`absolute bottom-0 left-0 h-[2px] bg-[#ffffff] shadow-[0_0_8px_#7fffd4] transition-all duration-300 ${location.pathname === "/shop" ? "w-full" : "w-0 group-hover:w-full"}`}
            ></span>
          </Link>
        </div>
      </div>

      {/* LOGOUT */}
      <div
        onClick={logout}
        className=" cursor-pointer bg-transparent border border-white/40 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-tighter text-white hover:!bg-white hover:!text-black transition-all duration-300 active:scale-90"
      >
        Logout
      </div>
    </nav>
  );
}
