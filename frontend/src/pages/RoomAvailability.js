import React, { useState, useEffect } from "react";
import axios from "axios";

const RoomAvailability = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewRoom, setViewRoom] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [editRoom, setEditRoom] = useState(null);

  const [editRoomData, setEditRoomData] = useState({
    number: "",
    status: "Available",
    occupants: [],
  });

  const [newRoomData, setNewRoomData] = useState({
    number: "",
    status: "Available",
    occupants: [],
  });

  const user = JSON.parse(localStorage.getItem("user")) || { role: "student" };

  // Fetch rooms from backend
  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rooms");
      setRooms(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Add new room
  const saveNewRoom = async () => {
    try {
      await axios.post("http://localhost:5000/api/rooms", newRoomData);
      const res = await axios.get("http://localhost:5000/api/rooms");
      setRooms(res.data);
      setAddModal(false);
      setNewRoomData({ number: "", status: "Available", occupants: [] });
    } catch (err) {
      console.error("Add room error:", err.response?.data || err.message);
    }
  };

  // Edit existing room
  const saveRoomEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/rooms/${editRoom._id}`,
        editRoomData
      );
      const res = await axios.get("http://localhost:5000/api/rooms");
      setRooms(res.data);
      setEditRoom(null);
    } catch (err) {
      console.error("Edit room error:", err.response?.data || err.message);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.number.includes(search) ||
      (room.occupants?.some((o) =>
        o.name.toLowerCase().includes(search.toLowerCase())
      ) ?? false);
    const matchesFilter = filter === "All" || room.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="room-page p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold">🏠 Room Availability</h2>
          <p className="text-gray-600">Check which rooms are available and occupied. </p>
        </div>
        {user.role === "admin" && (
          <button
            onClick={() => setAddModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Room
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by room number or occupant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
        </select>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room._id}
            className={`p-4 rounded shadow border-l-4 ${
              room.status === "Available"
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">{room.number}</h3>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  room.status === "Available"
                    ? "bg-green-200 text-green-700"
                    : "bg-red-200 text-red-700"
                }`}
              >
                {room.status}
              </span>
            </div>
            {room.status === "Occupied" && (
              <button
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => setViewRoom(room)}
              >
                View
              </button>
            )}
            {user.role === "admin" && (
              <button
                className="mt-2 ml-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => {
                  setEditRoom(room);
                  setEditRoomData(room);
                }}
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>

      {/* View Room Modal */}
      {viewRoom && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md w-full overflow-y-auto max-h-[80vh]">
            <h3 className="text-xl font-bold mb-4">Room {viewRoom.number} Occupants</h3>
            <ul className="space-y-2">
              {viewRoom.occupants.map((o, i) => (
                <li key={i} className="border-b pb-2">
                  <p><strong>Name:</strong> {o.name}</p>
                  <p><strong>Phone:</strong> {o.phone}</p>
                </li>
              ))}
            </ul>
            <button
              className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setViewRoom(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Room Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add Room</h3>
            <label>Room Number:</label>
            <input
              type="text"
              className="border p-2 w-full mb-2 rounded"
              value={newRoomData.number}
              onChange={(e) =>
                setNewRoomData({ ...newRoomData, number: e.target.value })
              }
            />
            <label>Status:</label>
            <select
              className="border p-2 w-full mb-2 rounded"
              value={newRoomData.status}
              onChange={(e) =>
                setNewRoomData({ ...newRoomData, status: e.target.value })
              }
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
            </select>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={saveNewRoom}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {editRoom && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Edit Room {editRoomData.number}</h3>
            <label>Room Number:</label>
            <input
              type="text"
              className="border p-2 w-full mb-2 rounded"
              value={editRoomData.number}
              onChange={(e) =>
                setEditRoomData({ ...editRoomData, number: e.target.value })
              }
            />
            <label>Status:</label>
            <select
              className="border p-2 w-full mb-2 rounded"
              value={editRoomData.status}
              onChange={(e) =>
                setEditRoomData({ ...editRoomData, status: e.target.value })
              }
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
            </select>
            <label>Occupants (comma separated: Name|Phone):</label>
            <textarea
              className="border p-2 w-full mb-2 rounded"
              rows={4}
              value={editRoomData.occupants.map((o) => `${o.name}|${o.phone}`).join(", ")}
              onChange={(e) => {
                const occupants = e.target.value.split(",").map((item) => {
                  const [name, phone] = item.split("|").map((str) => str.trim());
                  return { name, phone };
                });
               setEditRoomData({
  ...editRoomData,
  occupants,
  status: occupants.length > 0 ? "Occupied" : "Available",
});
              }}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setEditRoom(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={saveRoomEdit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomAvailability;
