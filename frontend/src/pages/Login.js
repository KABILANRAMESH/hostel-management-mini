import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
      role,
    });

    // Save user info and token in localStorage
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("token", res.data.token);

    setMessage("✅ Login successful!");

    // Redirect to Dashboard
    navigate("/dashboard");

  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      setMessage(`❌ ${err.response.data.message}`);
    } else {
      setMessage("❌ Server error. Please try again later.");
    }
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏨 Hostel Portal Login</h2>
        <form onSubmit={handleLogin}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
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
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #89f7fe, #66a6ff)",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
    width: "350px",
    textAlign: "center",
  },
  title: { marginBottom: "20px", color: "#333" },
  label: {
    display: "block",
    textAlign: "left",
    marginBottom: "5px",
    fontWeight: "bold",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "20px",
  },
  button: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007bff",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  message: {
    marginTop: "10px",
    fontWeight: "bold",
    color: "#b22222",
  },
};

export default Login;
