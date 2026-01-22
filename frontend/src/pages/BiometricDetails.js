import React, { useEffect, useState } from "react";
import axios from "axios";

const BiometricDetails = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/biometric")
      .then(res => setRecords(res.data))
      .catch(err => console.error(err));
  }, []);

  // Filter records based on search term
  const filteredRecords = records.filter(r =>
    r.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "15px", color: "#0f66c0" }}>Biometric Details</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by Roll Number or Name"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "15px",
          width: "100%",
          maxWidth: "400px",
          borderRadius: "4px",
          border: "1px solid #ccc"
        }}
      />

      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
        <thead>
          <tr style={{ background: "#0f66c0", color: "#fff" }}>
            <th style={{ padding: "8px" }}>Roll Number</th>
            <th style={{ padding: "8px" }}>Name</th>
            <th style={{ padding: "8px" }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((r, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "10px" }}>{r.rollNumber}</td>
              <td style={{ padding: "10px" }}>{r.name}</td>
              <td style={{ padding: "10px" }}>{new Date(r.timestamp).toLocaleString()}</td>
            </tr>
          ))}
          {filteredRecords.length === 0 && (
            <tr>
              <td colSpan="3" style={{ padding: "10px" }}>No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BiometricDetails;
