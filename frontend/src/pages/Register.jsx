import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  LockClosedIcon,
  UserIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const navigate = useNavigate();

  const validatePasswordStrength = (pwd) => {
    if (pwd.length < 6) return "Too short";
    if (!/[A-Z]/.test(pwd)) return "Add an uppercase letter";
    if (!/[0-9]/.test(pwd)) return "Add a number";
    if (!/[!@#$%^&*]/.test(pwd)) return "Add a special character";
    return "Strong";
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(validatePasswordStrength(pwd));
  };

  const USE_CAPTCHA = false;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (passwordStrength !== "Strong") {
      setError("Password is not strong enough");
      return;
    }

    try {
      // ... your existing fetch logic ...
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong during registration.");
    }
  };

  return (
    <div className="flex justify-center -mt-24 items-center min-h-screen bg-[url('/your-background.jpg')] bg-cover bg-center">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-xl shadow-lg w-full max-w-md relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-white/70 hover:text-white transition-colors text-sm"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-white tracking-wide">
          Create Account
        </h2>

        {error && (
          <p className="text-red-400 mb-4 text-center text-sm">{error}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Username */}
          <div className="flex items-center border border-white/30 rounded-md px-3 py-2 bg-transparent">
            <UserIcon className="w-5 h-5 text-white/80" />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="ml-2 w-full outline-none bg-transparent placeholder-white text-white"
            />
          </div>

          {/* Email */}
          <div className="flex items-center border border-white/30 rounded-md px-3 py-2 bg-transparent">
            <EnvelopeIcon className="w-5 h-5 text-white/80" />
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
              onChange={handlePasswordChange}
              required
              className="ml-2 w-full outline-none bg-transparent placeholder-white text-white"
            />
          </div>

          {password && (
            <p
              className={`text-xs mt-1 ${passwordStrength === "Strong" ? "text-green-400" : "text-yellow-400"}`}
            >
              Strength: {passwordStrength}
            </p>
          )}

          {/* Confirm Password */}
          <div className="flex items-center border border-white/30 rounded-md px-3 py-2 bg-transparent">
            <LockClosedIcon className="w-5 h-5 text-white/80" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="ml-2 w-full outline-none bg-transparent placeholder-white text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white/20 text-indigo-200 font-semibold py-2 rounded-md hover:bg-white/30 transition-all active:scale-95"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-white/70">
          Already have an account?{" "}
          <Link to="/login" className="text-red-300 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
