import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Laundry = ({ user }) => {
  const [laundries, setLaundries] = useState([]);
  const [laundryForm, setLaundryForm] = useState({
    studentName: "",
    rollNumber: "",
    givenDate: "",
    pickupDate: "",
    status: "In Progress",
  });
  const [pickupModal, setPickupModal] = useState(null);

  const fetchLaundries = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/laundry");
      const all = Array.isArray(res.data) ? res.data : [];
      setLaundries(all);
    } catch (err) {
      console.error("❌ Error fetching laundries:", err);
      setLaundries([]);
    }
  }, []);

  const addLaundry = async () => {
    const { studentName, rollNumber, givenDate } = laundryForm;
    if (!studentName || !rollNumber || !givenDate)
      return alert("⚠️ Fill all fields!");

    try {
      await axios.post("http://localhost:5000/api/laundry/add", laundryForm);
      fetchLaundries();
      setLaundryForm({
        studentName: "",
        rollNumber: "",
        givenDate: "",
        pickupDate: "",
        status: "In Progress",
      });
    } catch (err) {
      console.error("❌ Failed to add laundry:", err);
      alert("Failed to submit laundry.");
    }
  };

  const updateLaundryStatus = async (id, newStatus, pickupDate = null) => {
    try {
      await axios.put(`http://localhost:5000/api/laundry/update/${id}`, {
        status: newStatus,
        pickupDate,
      });
      fetchLaundries();
    } catch (err) {
      console.error("❌ Failed to update laundry:", err);
    }
  };

  useEffect(() => {
    fetchLaundries();
  }, [fetchLaundries]);

  return (
    <div className="laundry-section p-6 bg-gray-50 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Laundry Management</h2>

      {/* Student Form */}
      {user.role === "student" && (
        <div className="add-laundry-form flex flex-col md:flex-row gap-3 mb-6 bg-white p-4 rounded shadow-sm">
          <input
            type="text"
            placeholder="Enter Name"
            className="border p-2 rounded w-full md:w-1/4"
            value={laundryForm.studentName}
            onChange={e =>
              setLaundryForm({ ...laundryForm, studentName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Enter Roll Number"
            className="border p-2 rounded w-full md:w-1/4"
            value={laundryForm.rollNumber}
            onChange={e =>
              setLaundryForm({ ...laundryForm, rollNumber: e.target.value })
            }
          />
          <input
            type="date"
            className="border p-2 rounded w-full md:w-1/4"
            value={laundryForm.givenDate}
            onChange={e =>
              setLaundryForm({ ...laundryForm, givenDate: e.target.value })
            }
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={addLaundry}
          >
            Submit Laundry
          </button>
        </div>
      )}

      {/* Laundry Table */}
      <div className="overflow-x-auto bg-white rounded shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Student</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Roll</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Given</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Pickup</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
              {user.role === "admin" && (
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {laundries.length === 0 ? (
              <tr>
                <td
                  colSpan={user.role === "admin" ? 6 : 5}
                  className="px-4 py-3 text-center text-gray-500"
                >
                  No laundries found.
                </td>
              </tr>
            ) : (
              laundries.map(l => (
                <tr key={l._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{l.studentName}</td>
                  <td className="px-4 py-2">{l.rollNumber}</td>
                  <td className="px-4 py-2">
                    {new Date(l.givenDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {l.pickupDate
                      ? new Date(l.pickupDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white text-sm ${
                        l.status === "In Progress"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  {user.role === "admin" && l.status === "In Progress" && (
                    <td className="px-4 py-2">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        onClick={() =>
                          setPickupModal({ show: true, laundryId: l._id })
                        }
                      >
                        Complete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pickup Date Modal */}
      {pickupModal?.show && (
        <div className="modal-overlay fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="modal bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-3">Enter Pickup Date</h3>
            <input
              type="date"
              className="border p-2 rounded w-full mb-4"
              value={pickupModal.pickupDate || ""}
              onChange={e =>
                setPickupModal({ ...pickupModal, pickupDate: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 bg-gray-300 rounded"
                onClick={() => setPickupModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                onClick={() => {
                  if (!pickupModal.pickupDate)
                    return alert("⚠️ Select a pickup date!");
                  updateLaundryStatus(
                    pickupModal.laundryId,
                    "Completed",
                    pickupModal.pickupDate
                  );
                  setPickupModal(null);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laundry;
