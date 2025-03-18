"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [notificationEmail, setNotificationEmail] = useState(session?.user.notificationEmail || "");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "/api/auth/settings",
        { notificationEmail },
        { headers: { Authorization: `Bearer ${session?.accessToken}` } }
      );
      setStatus("Settings updated successfully!");
    } catch (err) {
      setStatus("Failed to update settings.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-space-black text-stellar-white min-h-screen">
        <Navbar />
        <section className="pt-24 pb-16 max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-center mb-6">Settings</h1>
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
            <input
              type="email"
              placeholder="Notification Email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              className="w-full p-4 bg-midnight-blue rounded-lg"
              required
            />
            <button
              type="submit"
              className="w-full bg-glow-cyan text-space-black py-4 rounded-lg font-semibold hover:bg-nebula-blue"
            >
              Save Settings
            </button>
            {status && <p className="text-center text-gray-300">{status}</p>}
          </form>
        </section>
      </div>
    </ProtectedRoute>
  );
}