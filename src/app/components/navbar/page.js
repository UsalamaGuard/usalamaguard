"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="nav-futuristic">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center">
            <div className="relative">
              <img
                src="/log.jpeg" // Ensure this path is correct
                alt="UsalamaAiGuard Logo"
                className="h-12 w-12 sm:h-16 sm:w-16 object-contain border-2 border-glow-cyan/50 shadow-glow-md p-1 bg-space-black/80"
              />
              {/* Embossed Frame Effect */}
              <div className="absolute inset-0 border border-cosmic-purple/30 shadow-inner pointer-events-none" />
            </div>
            <span className="header-gradient text-2xl sm:text-3xl ml-2 font-bold tracking-tight">
              UsalamaAiGuard
            </span>
          </Link>
        </div>

        {/* Hamburger Icon (visible below sm: 640px) */}
        <div className="sm:hidden">
          <button onClick={toggleMenu} className="text-stellar-white hover:text-glow-cyan">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Links - Hidden on small screens, visible on sm: and up */}
        <div
          className={`${
            isOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row items-center absolute sm:static top-16 left-0 w-full sm:w-auto bg-space-black/90 sm:bg-transparent px-6 py-4 sm:p-0 space-y-4 sm:space-y-0 sm:space-x-6 z-40`}
        >
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-glow-cyan transition-all duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/settings"
                className="hover:text-glow-cyan transition-all duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setIsOpen(false);
                }}
                className="hover:text-glow-cyan transition-all duration-300 text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-glow-cyan transition-all duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="hover:text-glow-cyan transition-all duration-300 text-center"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}