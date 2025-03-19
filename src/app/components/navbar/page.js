"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="nav-futuristic border-b border-glow-cyan/20 bg-gradient-to-r from-background via-background/95 to-background shadow-glow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-2">
        {/* Logo and Title - Extreme Left */}
        <div className="flex items-center space-x-2">
          <Link href="/dashboard" className="flex items-center">
            <div className="relative">
              <img
                src="/logi.jpeg" // Ensure this path is correct
                alt="UsalamaAiGuard Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain border-2 border-glow-cyan/50 shadow-glow-md p-1 rounded-full bg-background/80"
              />
              <div className="absolute inset-0 border border-cosmic-purple/30 shadow-inner pointer-events-none rounded-full" />
            </div>
            <span className="header-gradient text-xl sm:text-2xl font-bold tracking-tight">
              UsalamaGuard
            </span>
          </Link>
        </div>

        {/* Right Side: Links, Theme Toggle, and Hamburger */}
        <div className="flex items-center space-x-4">
          {/* Desktop Links */}
          <div className="hidden sm:flex items-center space-x-6">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-text hover:text-glow-cyan transition-all duration-300 font-medium text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="text-text hover:text-glow-cyan transition-all duration-300 font-medium text-sm"
                >
                  Settings
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-text hover:text-glow-cyan transition-all duration-300 font-medium text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-text hover:text-glow-cyan transition-all duration-300 font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-text hover:text-glow-cyan transition-all duration-300 font-medium text-sm"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-text hover:text-glow-cyan transition-all duration-300 p-1 rounded-full hover:bg-glow-cyan/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Hamburger Icon (visible below sm: 640px) */}
          <div className="sm:hidden">
            <button
              onClick={toggleMenu}
              className="text-text hover:text-glow-cyan transition-all duration-300 p-1 rounded-full hover:bg-glow-cyan/10"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Dropdown */}
      {isOpen && (
        <div className="sm:hidden bg-background/95 border-t border-glow-cyan/20 px-4 py-4 absolute top-full left-0 w-full z-40 shadow-glow-md">
          <div className="flex flex-col space-y-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-text hover:text-glow-cyan transition-all duration-300 text-center font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="text-text hover:text-glow-cyan transition-all duration-300 text-center font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="text-text hover:text-glow-cyan transition-all duration-300 text-center font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-text hover:text-glow-cyan transition-all duration-300 text-center font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-text hover:text-glow-cyan transition-all duration-300 text-center font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Signup
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className="text-text hover:text-glow-cyan transition-all duration-300 text-center font-medium"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}