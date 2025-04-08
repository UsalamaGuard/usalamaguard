"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [form, setForm] = useState({ email: "", password: "", notificationEmail: "", firstName: "" });
  const [error, setError] = useState("");
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraLocation, setCameraLocation] = useState("");
  const router = useRouter();

  // Use the backend URL from the environment variable
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/api/auth/signup`, form);
      setShowCameraModal(true); // Show modal after signup
    } catch (err) {
      setError("Signup failed. Email may already exist.");
    }
  };

  const handleCameraSubmit = async () => {
    try {
      const userRes = await axios.post(`${backendUrl}/api/auth/login`, {
        email: form.email,
        password: form.password,
      });
      await axios.patch(`${backendUrl}/api/users/${userRes.data.id}/camera-location`, {
        cameraLocation,
      });
      setShowCameraModal(false);
      router.push("/login");
    } catch (err) {
      console.error("Error setting camera location:", err);
      setError("Failed to set camera location");
    }
  };

  return (
    <div className="bg-space-black text-stellar-white min-h-screen flex items-center justify-center">
      <div className="p-8 bg-midnight-blue rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-4 bg-space-black rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full p-4 bg-space-black rounded-lg"
            required
          />
          <input
            type="email"
            placeholder="Notification Email"
            value={form.notificationEmail}
            onChange={(e) => setForm({ ...form, notificationEmail: e.target.value })}
            className="w-full p-4 bg-space-black rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="w-full p-4 bg-space-black rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-glow-cyan text-space-black py-4 rounded-lg font-semibold hover:bg-nebula-blue"
          >
            Sign Up
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link href="/login" className="text-glow-cyan">Login</Link>
        </p>
      </div>

      {showCameraModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-midnight-blue p-6 rounded-2xl shadow-md w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Set Camera Location</h2>
            <input
              type="text"
              placeholder="Camera Location (e.g., Gate A)"
              value={cameraLocation}
              onChange={(e) => setCameraLocation(e.target.value)}
              className="w-full p-4 bg-space-black rounded-lg mb-4"
              required
            />
            <button
              onClick={handleCameraSubmit}
              className="w-full bg-glow-cyan text-space-black py-4 rounded-lg font-semibold hover:bg-nebula-blue"
            >
              Save
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}