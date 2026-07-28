import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-ethiopia-green via-ethiopia-yellow to-ethiopia-red p-[2px]">
      <div className="bg-gray-900 px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🎵</span>
          <span className="text-xl font-bold text-white">Faarfannoota</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-300 hover:text-white text-sm font-medium transition">
             Home
          </Link>

          {user?.role === "admin" ? (
            <>
              <Link to="/admin" className="text-gray-300 hover:text-white text-sm font-medium transition">
                 Admin
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition"
            >
               Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
