import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const USE_CAPTCHA = false; // toggle this to true when ready to add CAPTCHA

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
            let captchaToken = null;

            if (USE_CAPTCHA) {
                // only run CAPTCHA if the flag is true
                await window.grecaptcha.ready(async () => {
                    captchaToken = await window.grecaptcha.execute(
                        "6Ld3RScrAAAAAP-O9BROgXndT7EUh-OIkjxNLrc8",
                        { action: "register" }
                    );
                });
            }

            const res = await fetch("http://localhost:4000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    ...(USE_CAPTCHA && { captchaToken }) // only include token if using CAPTCHA
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Registration failed");

            alert("Registration successful!");
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError(err.message || "Something went wrong during registration.");
        }
    };
    return (
        <div className="login-page">
            <div className="login-container">
                <button onClick={() => navigate(-1)} className="back-button">← Back</button>
                <h2 className="login-title">Create Account</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleRegister} className="login-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    {password && (
                        <p className="password-strength">
                            Strength: {passwordStrength}
                        </p>
                    )}
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-button">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;