import React from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

function Dashboard({ user, setUser }) {
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">Welcome, {user.email}!</h2>
      <button
        className="bg-red-500 text-white px-4 py-2"
        onClick={handleLogout}
      >
        Logout
      </button>
      {/* Placeholder for main content */}
      <div className="mt-8 text-gray-600">Your dashboard will appear here.</div>
    </div>
  );
}

export default Dashboard;
