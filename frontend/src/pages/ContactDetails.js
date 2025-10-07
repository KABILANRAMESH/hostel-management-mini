function ContactDetails({ isAdmin }) {
  return (
    <div>
      {isAdmin && (
        <button className="mb-4 px-3 py-1     bg-yellow-500 text-white rounded hover:bg-yellow-600">
          Edit Contacts
        </button>
      )}
      <ul className="space-y-2 text-gray-700">
        <li>Floor 1: Warden - John Doe</li>
        <li>Floor 2: Caretaker - Jane Smith</li>
        <li>Floor 3: Warden - Mike Lee</li>
      </ul>
    </div>
  );
}
export default ContactDetails;
