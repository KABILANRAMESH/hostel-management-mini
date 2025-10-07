function HostelMenu({ isAdmin }) {
  return (
    <div>
      {isAdmin && (
        <button className="mb-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">
          Edit Menu
        </button>
      )}
      <ul className="space-y-2">
        <li>Monday: Rice, Curry, Chapati</li>
        <li>Tuesday: Rice, Dal, Veg</li>
        <li>Wednesday: Idli, Sambar</li>
      </ul>
    </div>
  );
}
export default HostelMenu;
