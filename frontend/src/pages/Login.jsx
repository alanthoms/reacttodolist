import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LockClosedIcon, UserIcon } from "@heroicons/react/24/solid";

const siteKey = "6Ld3RScrAAAAAP-O9BROgXndT7EUh-OIkjxNLrc8";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const USE_CAPTCHA = false; // Toggle this to true when ready to add CAPTCHA

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      let captchaToken = null;

      if (USE_CAPTCHA) {
        await window.grecaptcha.ready(async () => {
          captchaToken = await window.grecaptcha.execute(siteKey, {
            action: "login",
          });
        });
      }

      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          ...(USE_CAPTCHA && { captchaToken }), // only include token if using CAPTCHA
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login Successful!");
      setIsAuthenticated(true); // instantly update App's state
      navigate("/Home");
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[url('/your-background.jpg')] bg-cover bg-center">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white tracking-wide">
          Login
        </h2>

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="flex items-center border border-white/30 rounded-md px-3 py-2 bg-transparent">
            <UserIcon className="w-5 h-5 text-white/80" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="ml-2 w-full outline-none bg-transparent placeholder-white text-white"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-white/30 rounded-md px-3 py-2 bg-transparent">
            <LockClosedIcon className="w-5 h-5 text-white/80" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="ml-2 w-full outline-none bg-transparent placeholder-white text-white"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-white/20 text-blue-500 font-semibold py-2 rounded-md hover:bg-white/30 transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-white/70">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-300 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
