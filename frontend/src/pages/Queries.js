import React, { useState, useEffect } from "react";
import axios from "axios";

const Queries = ({ user }) => {
  const [queries, setQueries] = useState([]);
  const [queryForm, setQueryForm] = useState({
    name: user.name || "",
    roll: user.rollNumber || "",
    issueType: "Food Related",
    message: "",
  });
  const [showQueryModal, setShowQueryModal] = useState(false);

  useEffect(() => {
    setQueryForm(prev => ({
      ...prev,
      name: user.name || "",
      roll: user.rollNumber || prev.roll,
    }));
  }, [user]);

  const fetchQueries = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/queries");
      setQueries(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching queries:", err);
      setQueries([]);
    }
  };

  const submitQuery = async () => {
    const { name, roll, issueType, message } = queryForm;
    if (!name || !roll || !message) {
      alert("⚠️ Please fill all fields!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/queries/add", {
        userId: user?.id || user?._id || "unknown",
        name,
        roll,
        issueType,
        message,
      });
      setQueries(prev => [res.data, ...prev]);
      setQueryForm(prev => ({ ...prev, message: "" }));
      alert("✅ Query submitted successfully!");
    } catch (err) {
      console.error("❌ Error submitting query:", err.response?.data || err.message);
      alert("Failed to submit query. See console for details.");
    }
  };

  const updateStatus = async (id) => {
    const feedback = prompt("Enter feedback for the student:");
    if (feedback === null) return;

    try {
      await axios.put(`http://localhost:5000/api/queries/update/${id}`, {
        status: "Resolved",
        feedback,
      });
      fetchQueries();
      alert("✅ Query marked as resolved with feedback!");
    } catch (err) {
      console.error("❌ Failed to update status:", err.response?.data || err.message);
      alert("Failed to update query. See console for details.");
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  return (
    <div className="queries-section p-6">
      {/* ===== Student Form ===== */}
      {user.role === "student" && (
        <div className="mb-6 border p-4 rounded shadow bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Submit Your Query</h2>
          <label>Name:</label>
          <input
            className="border p-2 w-full mb-2 rounded"
            value={queryForm.name}
            onChange={e => setQueryForm({ ...queryForm, name: e.target.value })}
          />
          <label>Roll Number:</label>
          <input
            className="border p-2 w-full mb-2 rounded"
            value={queryForm.roll}
            onChange={e => setQueryForm({ ...queryForm, roll: e.target.value })}
          />
          <label>Type of Issue:</label>
          <select
            className="border p-2 w-full mb-2 rounded"
            value={queryForm.issueType}
            onChange={e => setQueryForm({ ...queryForm, issueType: e.target.value })}
          >
            <option value="Food Related">Food Related</option>
            <option value="Electrical">Electrical</option>
            <option value="Regarding Room">Regarding Room</option>
            <option value="Others">Others</option>
          </select>
          <label>Message:</label>
          <textarea
            className="border p-2 w-full mb-2 rounded"
            value={queryForm.message}
            onChange={e => setQueryForm({ ...queryForm, message: e.target.value })}
          />
          <div className="flex gap-3 mt-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={submitQuery}>
              Submit
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => {
                fetchQueries();
                setShowQueryModal(true);
              }}
            >
              View All Queries
            </button>
          </div>
        </div>
      )}

      {/* ===== Admin Queries ===== */}
      {user.role === "admin" && (
        <div className="admin-queries mt-6">
          <h2 className="text-xl font-semibold mb-4">All Student Queries</h2>
          {queries.length === 0 ? (
            <p>No queries found.</p>
          ) : (
            queries.map(q => (
              <div key={q._id} className="border p-4 mb-3 rounded bg-white shadow">
                <p><strong>Name:</strong> {q.name}</p>
                <p><strong>Roll:</strong> {q.roll}</p>
                <p><strong>Issue Type:</strong> {q.issueType}</p>
                <p><strong>Message:</strong> {q.message}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={q.status === "Pending" ? "text-red-500" : "text-green-500"}>
                    {q.status}
                  </span>
                </p>
                {q.status === "Pending" && (
                  <button
                    className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
                    onClick={() => updateStatus(q._id)}
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ===== Query Modal ===== */}
      {showQueryModal && (
        <div className="modal-overlay">
          <div className="modal large relative">
            <button
              className="absolute top-3 right-4 text-red-500 text-2xl font-bold"
              onClick={() => setShowQueryModal(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-semibold text-center mb-5">All Queries</h2>
            {queries.length === 0 ? (
              <p className="text-center text-gray-500">No queries found.</p>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto space-y-4">
                {queries.map(q => (
                  <div
                    key={q._id}
                    className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
                  >
                    <p><strong>Name:</strong> {q.name}</p>
                    <p><strong>Roll:</strong> {q.roll}</p>
                    <p><strong>Issue Type:</strong> {q.issueType}</p>
                    <p><strong>Message:</strong> {q.message}</p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`font-semibold ${
                          q.status === "Pending" ? "text-yellow-600" : "text-green-600"
                        }`}
                      >
                        {q.status}
                      </span>
                    </p>
                    {q.feedback && <p><strong>Feedback:</strong> {q.feedback}</p>}
                    <p className="text-sm text-gray-500 mt-2">
                      Submitted: {new Date(q.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Queries;
