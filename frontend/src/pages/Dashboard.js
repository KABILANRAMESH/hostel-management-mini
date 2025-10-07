import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import RoomAvailability from "./RoomAvailability";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")) || { role: "student", _id: "", name: "" };

  const [activeTab, setActiveTab] = useState("menu");
  const [meals, setMeals] = useState([]);
  const [editDay, setEditDay] = useState(null);
  const [form, setForm] = useState({ breakfast: "", lunch: "", dinner: "" });
  const [queries, setQueries] = useState([]);
  const [queryForm, setQueryForm] = useState({
    name: user.name || "",
    roll: "",
    issueType: "Food Related",
    message: ""
  });

  const tabs = [
    { id: "menu", label: "Menu" },
    { id: "rooms", label: "Room Availability" },
    { id: "queries", label: "Queries" },
    { id: "contacts", label: "Contact Details" },
  ];

  // =================== Menu ===================
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/menu")
      .then((res) => setMeals(res.data))
      .catch((err) => console.error("❌ Error fetching menu:", err));
  }, []);

  const handleEdit = (day) => {
    setEditDay(day);
    setForm({
      breakfast: day.breakfast.join(", "),
      lunch: day.lunch.join(", "),
      dinner: day.dinner.join(", "),
    });
  };

  const saveEdit = async () => {
    const updatedData = {
      day: editDay.day,
      breakfast: form.breakfast.split(",").map((i) => i.trim()),
      lunch: form.lunch.split(",").map((i) => i.trim()),
      dinner: form.dinner.split(",").map((i) => i.trim()),
    };
    try {
      await axios.post("http://localhost:5000/api/menu", updatedData);
      const res = await axios.get("http://localhost:5000/api/menu");
      setMeals(res.data);
      setEditDay(null);
    } catch (err) {
      console.error("❌ Error updating menu:", err);
    }
  };

  // =================== Queries ===================
  const fetchQueries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries");
      setQueries(res.data);
    } catch (err) {
      console.error("Error fetching queries:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "queries") fetchQueries();
  }, [activeTab]);

  const submitQuery = async () => {
    if (!queryForm.message || !queryForm.roll) return; // validate required fields
    try {
      await axios.post("http://localhost:5000/api/queries", {
        userId: user._id,
        name: queryForm.name,
        roll: queryForm.roll,
        issueType: queryForm.issueType,
        message: queryForm.message,
      });
      setQueryForm({ name: user.name, roll: "", issueType: "Food Related", message: "" });
      fetchQueries();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/queries/${id}`, { status });
      fetchQueries();
    } catch (err) {
      console.error(err);
    }
  };

  // =================== Render ===================
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <h1 className="logo">HostelHub</h1>
          <nav className="nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="sidebar-bottom">
          <button className="logout">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">
        <header className="main-header">
          <h2>Welcome, {user.role === "admin" ? "Admin" : "Student"}!</h2>
          <p>Manage the hostel menu, rooms, and queries.</p>
        </header>

        {/* MENU */}
        {activeTab === "menu" && (
          <section className="menu-section">
            <div className="timings-card">
              <div><h3>Breakfast</h3><p>7:00 AM - 9:00 AM</p></div>
              <div><h3>Lunch</h3><p>12:00 PM - 2:00 PM</p></div>
              <div><h3>Dinner</h3><p>7:00 PM - 9:00 PM</p></div>
            </div>
            <div className="days-grid">
              {meals.map((day) => (
                <div className="day-card" key={day.day}>
                  <div className="day-header">
                    <h3>{day.day}</h3>
                    {user.role === "admin" && (
                      <button onClick={() => handleEdit(day)}>Edit</button>
                    )}
                  </div>
                  <div className="meal">
                    <h4>Breakfast</h4>
                    <ul>{day.breakfast.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                  </div>
                  <div className="meal">
                    <h4>Lunch</h4>
                    <ul>{day.lunch.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                  </div>
                  <div className="meal">
                    <h4>Dinner</h4>
                    <ul>{day.dinner.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Modal */}
            {editDay && (
              <div className="modal-overlay">
                <div className="modal">
                  <h2>Edit Menu - {editDay.day}</h2>
                  <label>Breakfast (comma-separated):</label>
                  <input
                    type="text"
                    value={form.breakfast}
                    onChange={(e) => setForm({ ...form, breakfast: e.target.value })}
                  />
                  <label>Lunch (comma-separated):</label>
                  <input
                    type="text"
                    value={form.lunch}
                    onChange={(e) => setForm({ ...form, lunch: e.target.value })}
                  />
                  <label>Dinner (comma-separated):</label>
                  <input
                    type="text"
                    value={form.dinner}
                    onChange={(e) => setForm({ ...form, dinner: e.target.value })}
                  />
                  <div className="modal-actions">
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={() => setEditDay(null)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ROOMS */}
        {activeTab === "rooms" && <RoomAvailability />}

        {/* QUERIES */}
        {activeTab === "queries" && (
          <div className="queries-section">
            {/* Student Form */}
            {user.role === "student" && (
              <div className="mb-6 border p-4 rounded shadow bg-gray-50">
                <label className="block mb-2 font-semibold">Name:</label>
                <input
                  type="text"
                  className="border p-2 w-full mb-2 rounded"
                  value={queryForm.name}
                  onChange={(e) => setQueryForm({ ...queryForm, name: e.target.value })}
                />

                <label className="block mb-2 font-semibold">Roll Number:</label>
                <input
                  type="text"
                  className="border p-2 w-full mb-2 rounded"
                  value={queryForm.roll}
                  onChange={(e) => setQueryForm({ ...queryForm, roll: e.target.value })}
                />

                <label className="block mb-2 font-semibold">Type of Issue:</label>
                <select
                  className="border p-2 w-full mb-2 rounded"
                  value={queryForm.issueType}
                  onChange={(e) => setQueryForm({ ...queryForm, issueType: e.target.value })}
                >
                  <option value="Food Related">Food Related</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Regarding Room">Regarding Room</option>
                  <option value="Others">Others</option>
                </select>

                <label className="block mb-2 font-semibold">Message:</label>
                <textarea
                  className="border p-2 w-full mb-2 rounded"
                  placeholder="Write your query..."
                  value={queryForm.message}
                  onChange={(e) => setQueryForm({ ...queryForm, message: e.target.value })}
                />

                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={submitQuery}
                >
                  Submit
                </button>
              </div>
            )}

            {/* Queries List */}
            <div className="space-y-4">
              {queries.map((q) => (
                <div key={q._id} className="border p-4 rounded shadow">
                  <p><strong>Name:</strong> {q.name}</p>
                  <p><strong>Roll Number:</strong> {q.roll}</p>
                  <p><strong>Issue Type:</strong> {q.issueType}</p>
                  <p><strong>Message:</strong> {q.message}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={q.status === "Pending" ? "text-red-500" : "text-green-500"}>
                      {q.status}
                    </span>
                  </p>
                  {user.role === "admin" && q.status === "Pending" && (
                    <button
                      className="mt-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => updateStatus(q._id, "Resolved")}
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACTS Placeholder */}
        {activeTab === "contacts" && (
          <div className="placeholder">
            <h3>Contact Details</h3>
            <p>Content for Contact Details</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
