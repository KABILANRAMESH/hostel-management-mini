import React, { useState, useEffect } from "react";
import axios from "axios";
import RoomAvailability from "./RoomAvailability";
import ContactDetails from "../pages/ContactDetails";
import Laundry from "../pages/Laundry";
import Queries from "../pages/Queries";
import BiometricDetails from "../pages/BiometricDetails";
import { Home, ClipboardList, Bed, Phone, LogOut, Sparkles, Fingerprint } from "lucide-react";



const Dashboard = () => {
  const [user] = useState(() =>
    JSON.parse(localStorage.getItem("user")) || {
      role: "student",
      id: "",
      name: "",
      rollNumber: "",
    }
  );

  const [activeTab, setActiveTab] = useState("menu");
  const [meals, setMeals] = useState([]);
  const [editDay, setEditDay] = useState(null);
  const [form, setForm] = useState({ breakfast: "", lunch: "", dinner: "" });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/menu")
      .then((res) => setMeals(res.data || []))
      .catch((err) => console.error("❌ Error fetching menu:", err));
  }, []);

  const handleEdit = (day) => {
    setEditDay(day);
    setForm({
      breakfast: (day.breakfast || []).join(", "),
      lunch: (day.lunch || []).join(", "),
      dinner: (day.dinner || []).join(", "),
    });
  };

  const saveEdit = async () => {
    try {
      const updatedData = {
        day: editDay.day,
        breakfast: form.breakfast.split(",").map((i) => i.trim()),
        lunch: form.lunch.split(",").map((i) => i.trim()),
        dinner: form.dinner.split(",").map((i) => i.trim()),
      };
      await axios.post("http://localhost:5000/api/menu", updatedData);
      const res = await axios.get("http://localhost:5000/api/menu");
      setMeals(res.data || []);
      setEditDay(null);
    } catch (err) {
      console.error("❌ Error updating menu:", err);
    }
  };

  const tabs = [
    { id: "menu", label: "Menu", icon: <Home size={18} /> },
    { id: "rooms", label: "Room Availability", icon: <Bed size={18} /> },
    { id: "queries", label: "Queries", icon: <ClipboardList size={18} /> },
    { id: "contacts", label: "Contact Details", icon: <Phone size={18} /> },
    { id: "laundry", label: "Laundry", icon: <Sparkles size={18} /> },
    { id: "biometric", label: "Biometric Details", icon: <Fingerprint size={18} /> },
  ];

  // ==== Styles ====
  const styles = {
    dashboard: {
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e0f2ff 0%, #ffffff 100%)",
      fontFamily: "Poppins, sans-serif",
    },
    sidebar: {
      width: "230px",
      background: "linear-gradient(180deg, #0f66c0, #1096d4)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "25px 20px",
      color: "#fff",
      boxShadow: "2px 0 10px rgba(0,0,0,0.15)",
    },
    logo: {
      fontSize: "1.9rem",
      fontWeight: "700",
      textAlign: "left",
      letterSpacing: "1px",
      marginBottom: "35px",
    },
    nav: { display: "flex", flexDirection: "column", gap: "12px" },
    navItem: (active) => ({
      background: active ? "rgba(255,255,255,0.25)" : "transparent",
      color: active ? "#fff" : "#e5e5e5",
      padding: "10px 12px",
      borderRadius: "10px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontWeight: "500",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s",
    }),
    logout: {
      background: "#ff5c5c",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      padding: "10px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
    },
    main: {
      flex: 1,
      padding: "40px",
      overflowY: "auto",
      backdropFilter: "blur(10px)",
    },
    headerTitle: { fontSize: "2rem", color: "#0f66c0", marginBottom: "5px" },
    subText: { color: "#666", marginBottom: "25px" },
    timingsCard: {
      display: "flex",
      justifyContent: "space-around",
      background: "rgba(255,255,255,0.9)",
      padding: "20px",
      borderRadius: "15px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
      marginBottom: "35px",
    },
    timeItem: { textAlign: "center", color: "#0f66c0" },
    daysGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "25px",
    },
    dayCard: {
      background: "rgba(255,255,255,0.85)",
      padding: "20px",
      borderRadius: "16px",
      boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
      transition: "transform 0.25s ease, box-shadow 0.25s",
    },
    dayHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    editBtn: {
      background: "#0f66c0",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      padding: "6px 12px",
      cursor: "pointer",
      fontSize: "0.9rem",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modal: {
      background: "white",
      padding: "25px",
      borderRadius: "12px",
      width: "400px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    },
    modalInput: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      marginBottom: "10px",
    },
    saveBtn: {
      background: "#4caf50",
      color: "white",
      border: "none",
      padding: "10px 15px",
      borderRadius: "8px",
      cursor: "pointer",
    },
    cancelBtn: {
      background: "#e53935",
      color: "white",
      border: "none",
      padding: "10px 15px",
      borderRadius: "8px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.dashboard}>
      <aside style={styles.sidebar}>
        <div>
          <h1 style={styles.logo}>🏠 HostelHub</h1>
          <nav style={styles.nav}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                style={styles.navItem(activeTab === tab.id)}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <button
          style={styles.logout}
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <main style={styles.main}>
        <h2 style={styles.headerTitle}>
          Welcome, {user.role === "admin" ? "Admin" : "Student"}!
        </h2>
        <p style={styles.subText}>
          Manage your hostel menu, rooms, laundry and queries in one place.
        </p>

        {/* ===== MENU ===== */}
        {activeTab === "menu" && (
          <>
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "25px",
  }}
>
  {meals.map((day, index) => (
    <div
      key={index}
      style={{
        background: "rgba(255, 255, 255, 0.75)",
        borderRadius: "20px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        padding: "25px",
        transition: "all 0.3s ease",
        border: "1px solid rgba(200,200,200,0.3)",
        backdropFilter: "blur(8px)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-6px)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0)")
      }
    >
      {/* Day Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <h3
          style={{
            fontSize: "1.3rem",
            color: "#0f66c0",
            fontWeight: "600",
            letterSpacing: "0.5px",
          }}
        >
          {day.day}
        </h3>
        {user.role === "admin" && (
          <button
            onClick={() => handleEdit(day)}
            style={{
              background: "#0f66c0",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "6px 12px",
              cursor: "pointer",
              fontSize: "0.85rem",
              boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
            }}
          >
            Edit
          </button>
        )}
      </div>

      {/* Meal Sections */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {[
          { name: "Breakfast", emoji: "🍞", color: "#f4f9ff" },
          { name: "Lunch", emoji: "🍛", color: "#fdfaf2" },
          { name: "Dinner", emoji: "🌙", color: "#f8f4ff" },
        ].map((meal) => (
          <div
            key={meal.name}
            style={{
              background: meal.color,
              padding: "10px 15px",
              borderRadius: "10px",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <h4
              style={{
                margin: "0 0 6px 0",
                color: "#0f66c0",
                fontSize: "1rem",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>{meal.emoji}</span> {meal.name}
            </h4>
            <ul
              style={{
                listStyle: "disc",
                paddingLeft: "20px",
                margin: 0,
                color: "#333",
                fontSize: "0.95rem",
              }}
            >
              {(day[meal.name.toLowerCase()] || []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>


          </>
        )}

        {activeTab === "rooms" && <RoomAvailability />}
        {activeTab === "queries" && <Queries user={user} />}
        {activeTab === "laundry" && <Laundry user={user} />}
        {activeTab === "contacts" && <ContactDetails user={user} />}
{activeTab === "biometric" && <BiometricDetails />}


        {editDay && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2>Edit Menu - {editDay.day}</h2>
              {["breakfast", "lunch", "dinner"].map((meal) => (
                <div key={meal}>
                  <label>
                    {meal.charAt(0).toUpperCase() + meal.slice(1)}:
                  </label>
                  <input
                    style={styles.modalInput}
                    type="text"
                    value={form[meal]}
                    onChange={(e) =>
                      setForm({ ...form, [meal]: e.target.value })
                    }
                  />
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "10px",
                }}
              >
                <button style={styles.saveBtn} onClick={saveEdit}>
                  Save
                </button>
                <button
                  style={styles.cancelBtn}
                  onClick={() => setEditDay(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
