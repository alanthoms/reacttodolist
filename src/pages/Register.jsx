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

    const res = await fetch("http://localhost:5000/api/auth/register", {
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
