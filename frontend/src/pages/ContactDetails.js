import React, { useState, useEffect } from "react";
import axios from "axios";

const ContactDetails = ({ user }) => {
  const [contacts, setContacts] = useState([]);
  const [editContacts, setEditContacts] = useState(null);
  const [showContactsModal, setShowContactsModal] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contacts");
      setContacts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error fetching contacts:", err);
      setContacts([]);
    }
  };

  const saveContacts = async () => {
    if (!editContacts.floor) return alert("⚠️ Floor is required.");
    try {
      const payload = {
        floor: editContacts.floor,
        warden: { name: editContacts.wardenName || "", phone: editContacts.wardenPhone || "" },
        caretaker: { name: editContacts.caretakerName || "", phone: editContacts.caretakerPhone || "" },
        electrical: { name: editContacts.electricalName || "", phone: editContacts.electricalPhone || "" },
        plumber: { name: editContacts.plumberName || "", phone: editContacts.plumberPhone || "" },
      };

      await axios.put(`http://localhost:5000/api/contacts/${editContacts.floor}`, payload);
      alert("✅ Contacts updated successfully!");
      fetchContacts();
      setEditContacts(null);
      setShowContactsModal(false);
    } catch (err) {
      console.error("❌ Failed to update contacts:", err);
      alert("Failed to update contacts.");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3f2fd, #f8faff)",
        padding: "40px",
      }}
    >
      <h2
        style={{
          fontSize: "1.8rem",
          fontWeight: "700",
          color: "#0f66c0",
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        🧭 Contact Details
      </h2>

      {/* Contacts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "25px",
        }}
      >
        {contacts.map((c) => (
          <div
            key={c.floor}
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              borderRadius: "16px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
              padding: "20px 25px",
              transition: "0.3s",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <h3
              style={{
                fontSize: "1.2rem",
                color: "#0f66c0",
                fontWeight: "600",
                marginBottom: "15px",
              }}
            >
              🏢 Floor: {c.floor}
            </h3>

            <div style={{ lineHeight: "1.8", color: "#333" }}>
              <p>
                <strong>Warden:</strong> {c.warden.name} ({c.warden.phone})
              </p>
              <p>
                <strong>Caretaker:</strong> {c.caretaker.name} ({c.caretaker.phone})
              </p>
              <p>
                <strong>Electrical:</strong> {c.electrical.name} ({c.electrical.phone})
              </p>
              <p>
                <strong>Plumber:</strong> {c.plumber.name} ({c.plumber.phone})
              </p>
            </div>

            {user.role === "admin" && (
              <button
                onClick={() => {
                  setEditContacts({
                    floor: c.floor,
                    wardenName: c.warden.name,
                    wardenPhone: c.warden.phone,
                    caretakerName: c.caretaker.name,
                    caretakerPhone: c.caretaker.phone,
                    electricalName: c.electrical.name,
                    electricalPhone: c.electrical.phone,
                    plumberName: c.plumber.name,
                    plumberPhone: c.plumber.phone,
                  });
                  setShowContactsModal(true);
                }}
                style={{
                  marginTop: "15px",
                  background: "#0f66c0",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontWeight: "500",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                }}
              >
                ✏️ Edit
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showContactsModal && editContacts && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "25px 30px",
              width: "400px",
              position: "relative",
              boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
            }}
          >
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "#c00",
              }}
              onClick={() => setShowContactsModal(false)}
            >
              ✖
            </button>

            <h3 style={{ color: "#0f66c0", marginBottom: "15px" }}>
              Edit Contacts – Floor {editContacts.floor}
            </h3>

            {["warden", "caretaker", "electrical", "plumber"].map((role) => (
              <div key={role} style={{ marginBottom: "12px" }}>
                <label style={{ fontWeight: "600" }}>
                  {role.charAt(0).toUpperCase() + role.slice(1)} Name:
                </label>
                <input
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "4px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  value={editContacts[`${role}Name`]}
                  onChange={(e) =>
                    setEditContacts({
                      ...editContacts,
                      [`${role}Name`]: e.target.value,
                    })
                  }
                />
                <label style={{ fontWeight: "600" }}>
                  {role.charAt(0).toUpperCase() + role.slice(1)} Phone:
                </label>
                <input
                  style={{
                    width: "100%",
                    padding: "8px",
                    marginTop: "4px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                  value={editContacts[`${role}Phone`]}
                  onChange={(e) =>
                    setEditContacts({
                      ...editContacts,
                      [`${role}Phone`]: e.target.value,
                    })
                  }
                />
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                style={{
                  background: "#0f66c0",
                  color: "#fff",
                  padding: "8px 14px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={saveContacts}
              >
                Save
              </button>
              <button
                style={{
                  background: "#ccc",
                  padding: "8px 14px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onClick={() => setShowContactsModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDetails;
