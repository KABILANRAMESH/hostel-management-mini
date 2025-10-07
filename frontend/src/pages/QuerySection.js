import React, { useState, useEffect } from "react";
import axios from "axios";

const QuerySection = () => {
  const [queries, setQueries] = useState([]);
  const [form, setForm] = useState({ name: "", roll: "", type: "Food", message: "" });
  const user = JSON.parse(localStorage.getItem("user")) || { role: "student", _id: "" };

  // Fetch queries
  const fetchQueries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries");
      setQueries(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  // Submit query (Student)
const submitQuery = async () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  console.log("🧠 Stored user:", storedUser);
  if (!storedUser || !storedUser.id) {
    alert("User info not found! Please log in again.");
    return;
  }

  const newQueryData = {
    userId: storedUser.id, // ✅ fix: send correct field name
    name,
    rollNumber,
    issueType,
    message,
  };
console.log("📦 Sending query:", newQueryData);
  try {
    const res = await axios.post("http://localhost:5000/api/queries", newQueryData);
    alert("✅ Query submitted successfully!");
    setMessage("");
    setRollNumber("");
    setIssueType("");
    fetchQueries();
  } catch (err) {
    console.error("Error submitting query:", err);
    alert("❌ Failed to submit query.");
  }
};


  // Update status (Admin)
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/queries/${id}`, { status });
      fetchQueries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📩 Queries</h2>

      {/* Student Query Form */}
      {user.role === "student" && (
        <div className="mb-6 space-y-2">
          <input
            type="text"
            placeholder="First Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Roll Number"
            value={form.roll}
            onChange={(e) => setForm({ ...form, roll: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-2 w-full rounded"
          >
            <option value="Food">Food Related</option>
            <option value="Electrical">Electrical</option>
            <option value="Room">Regarding Room</option>
            <option value="Others">Others</option>
          </select>
          <textarea
            placeholder="Message / Details"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="border p-2 w-full rounded"
            rows={3}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={submitQuery}
          >
            Submit
          </button>
        </div>
      )}

      {/* Query List */}
      <div className="space-y-4">
        {queries.map((q) => (
          <div key={q._id} className="border p-4 rounded shadow">
            <p><strong>Name:</strong> {q.name}</p>
            <p><strong>Roll Number:</strong> {q.roll}</p>
            <p><strong>Type:</strong> {q.type}</p>
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
  );
};

export default QuerySection;
