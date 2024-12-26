"use client"; // Mark as a client-side component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/router for pages directory
import Link from "next/link";
import "./Login.css"; // Import your CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleGoogleAuth = () => {
    router.push("http://localhost:5000/auth/google");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid email or password.");
      }

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateNewAccount=()=>{
    console.log('clicked')
    router.push('/SignUp')
  }

  return (
    <div className="login-container">
     
        <div className="login-box">
          <h2 className="login-title">Login</h2>
          {error && <p className="login-error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter your password"
              />
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2"
                />
                Remember Me
              </label>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            <Link href="/forgotPassword" className="forgot-password-link">
              Forgot Password?
            </Link>
            <br />
          </form>

          <button onClick={()=>handleCreateNewAccount()} className="login-button">
            Create New Account
          </button>
          <p>or</p>

          <button className="continue-with-google" onClick={handleGoogleAuth}>
            Continue with Google
          </button>
        </div>
  
    </div>
  );
};

export default Login;
