import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold">🎓 Student Survey</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:text-gray-200 transition">View Surveys</Link>
          <Link to="/new" className="hover:text-gray-200 transition">New Survey</Link>
        </div>
      </div>
    </nav>
  );
}
