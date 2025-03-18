"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 w-full bg-space-black text-stellar-white py-4 shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold">UsalamaAiGuard</Link>
        {session && (
          <div className="space-x-6">
            <Link href="/dashboard" className="hover:text-glow-cyan">Dashboard</Link>
            <Link href="/settings" className="hover:text-glow-cyan">Settings</Link>
            <button onClick={() => signOut()} className="hover:text-glow-cyan">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}