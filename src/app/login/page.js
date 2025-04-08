"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // Added for manual redirection
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter(); // Added to manually redirect on success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Submitting login form with:", form);
    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false, // Changed to false to handle redirect manually
    });
    console.log("signIn response:", res);
    if (res?.error) {
      console.log("Login error from NextAuth:", res.error);
      setError("Invalid credentials"); // Display a user-friendly message
    } else if (res?.ok) {
      console.log("Login successful, redirecting to dashboard");
      router.push("/dashboard"); // Manually redirect to dashboard
    } else {
      console.log("Unexpected response:", res);
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="bg-space-black text-stellar-white min-h-screen flex items-center justify-center">
      <div className="p-8 bg-midnight-blue rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
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
          <button
            type="submit"
            className="w-full bg-glow-cyan text-space-black py-4 rounded-lg font-semibold hover:bg-nebula-blue"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <p className="mt-4 text-center">
          Don’t have an account? <Link href="/signup" className="text-glow-cyan">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}