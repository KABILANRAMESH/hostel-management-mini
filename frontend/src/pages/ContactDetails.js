import React, { useState, useEffect } from "react";
import API from "../api"; // ✅ use shared API (no localhost)

const ContactDetails = ({ user }) => {
  const [contacts, setContacts] = useState([]);
  const [editContacts, setEditContacts] = useState(null);
  const [showContactsModal, setShowContactsModal] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await API.get("/contacts");
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
        warden: {
          name: editContacts.wardenName || "",
          phone: editContacts.wardenPhone || "",
        },
        caretaker: {
          name: editContacts.caretakerName || "",
          phone: editContacts.caretakerPhone || "",
        },
        electrical: {
          name: editContacts.electricalName || "",
          phone: editContacts.electricalPhone || "",
        },
        plumber: {
          name: editContacts.plumberName || "",
          phone: editContacts.plumberPhone || "",
        },
      };

      await API.put(`/contacts/${editContacts.floor}`, payload);
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
              background: "rgba(255,255,255,0.9)",
              borderRadius: "16px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.08)",
              padding: "20px 25px",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ color: "#0f66c0" }}>🏢 Floor: {c.floor}</h3>

            <p><strong>Warden:</strong> {c.warden.name} ({c.warden.phone})</p>
            <p><strong>Caretaker:</strong> {c.caretaker.name} ({c.caretaker.phone})</p>
            <p><strong>Electrical:</strong> {c.electrical.name} ({c.electrical.phone})</p>
            <p><strong>Plumber:</strong> {c.plumber.name} ({c.plumber.phone})</p>

            {user?.role === "admin" && (
              <button
                style={{
                  marginTop: "10px",
                  background: "#0f66c0",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
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
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", width: "400px" }}>
            <h3>Edit Contacts – Floor {editContacts.floor}</h3>

            {["warden", "caretaker", "electrical", "plumber"].map((role) => (
              <div key={role}>
                <input
                  placeholder={`${role} name`}
                  value={editContacts[`${role}Name`]}
                  onChange={(e) =>
                    setEditContacts({ ...editContacts, [`${role}Name`]: e.target.value })
                  }
                />
                <input
                  placeholder={`${role} phone`}
                  value={editContacts[`${role}Phone`]}
                  onChange={(e) =>
                    setEditContacts({ ...editContacts, [`${role}Phone`]: e.target.value })
                  }
                />
              </div>
            ))}

            <button onClick={saveContacts}>Save</button>
            <button onClick={() => setShowContactsModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactDetails;
