import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // Generate soft glowing stars
    const starCount = 100;
    const s = [];
    for (let i = 0; i < starCount; i++) {
      s.push({
        top: Math.random() * 100 + "%",
        left: Math.random() * 100 + "%",
        size: Math.random() * 2 + 1 + "px",
        opacity: Math.random() * 0.5 + 0.5,
        delay: Math.random() * 5 + "s",
        duration: Math.random() * 3 + 2 + "s",
      });
    }
    setStars(s);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: res.data.user.name,
          role: res.data.user.role,
          id: res.data.user._id,
        })
      );
      localStorage.setItem("token", res.data.token);

      setMessage("✅ Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Server error");
    }
  };

  return (
    <div style={styles.container}>
      {/* Stars */}
      {stars.map((star, i) => (
        <div key={i} style={{ ...styles.star, ...star }} />
      ))}

      {/* Login Card */}
      <div style={styles.card}>
        <h2 style={styles.title}>🌌 HOSTEL Portal Login</h2>
        <form onSubmit={handleLogin}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <label style={styles.label}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <label style={styles.label}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.select}
          >
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        <p style={styles.message}>{message}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "relative",
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to bottom, #6a85b6, #bac8e0)", // softer twilight blue
    overflow: "hidden",
  },
  star: {
    position: "absolute",
    background: "rgba(255,255,255,0.8)",
    borderRadius: "50%",
    animationName: "twinkle",
    animationIterationCount: "infinite",
    animationDirection: "alternate",
    animationTimingFunction: "ease-in-out",
  },
  card: {
    position: "relative",
    backgroundColor: "rgba(255,255,255,0.95)",
    color: "#222",
    padding: "40px 30px",
    borderRadius: "20px",
    boxShadow: "0 0 30px rgba(0,0,0,0.15)",
    width: "360px",
    textAlign: "center",
    zIndex: 2,
  },
  title: { marginBottom: "25px", color: "#3f51b5", fontSize: "1.8rem", fontWeight: "700" },
  label: { display: "block", textAlign: "left", marginBottom: "5px", fontWeight: "600", color: "#333" },
  input: { width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #aaa", marginBottom: "15px", background: "#f9f9f9", color: "#222" },
  select: { width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #aaa", marginBottom: "20px", background: "#f9f9f9", color: "#222", cursor: "pointer" },
  button: { width: "100%", padding: "12px", border: "none", borderRadius: "12px", backgroundColor: "#3f51b5", color: "white", fontWeight: "700", cursor: "pointer", fontSize: "1rem", boxShadow: "0 4px 15px rgba(63,81,181,0.4)" },
  message: { marginTop: "15px", fontWeight: "600", color: "#e53935" },
};

// Insert twinkle keyframes dynamically
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes twinkle {
  from { opacity: 0.3; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1.2); }
}`, styleSheet.cssRules.length);

export default Login;
