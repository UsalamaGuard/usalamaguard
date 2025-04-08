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
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-glow-cyan/30 bg-gradient-to-r from-background via-background/98 to-background shadow-glow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-3">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <Link href="/dashboard" className="flex items-center">
            <div className="relative">
              <img
                src="/logi.jpeg"
                alt="UsalamaAiGuard Logo"
                className="h-9 w-9 sm:h-11 sm:w-11 object-contain border-2 border-glow-cyan/60 rounded-full p-1 bg-background/90 shadow-glow-md transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 border border-cosmic-purple/40 shadow-inner rounded-full pointer-events-none" />
            </div>
            <span className="header-gradient text-xl sm:text-2xl font-bold tracking-tight bg-clip-text text-transparent">
              UsalamaGuard
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-6">
            {session ? (
              <>
                <span className="text-glow-cyan font-semibold text-sm bg-glow-cyan/10 px-3 py-1 rounded-full shadow-inner">
                  Welcome, {session.user.firstName}
                </span>
                <Link
                  href="/dashboard"
                  className="text-text hover:text-glow-cyan hover:bg-glow-cyan/20 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="text-text hover:text-glow-cyan hover:bg-glow-cyan/20 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm"
                >
                  Settings
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-text hover:text-glow-cyan hover:bg-glow-cyan/20 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-text hover:text-glow-cyan hover:bg-glow-cyan/20 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-text hover:text-glow-cyan hover:bg-glow-cyan/20 px-3 py-2 rounded-lg transition-all duration-300 font-medium text-sm"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="text-text hover:text-glow-cyan hover:bg-glow-cyan/20 p-2 rounded-full transition-all duration-300"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Mobile Menu Toggle */}
          <div className="sm:hidden">
            <button
              onClick={toggleMenu}
              className="text-text hover:text-glow-cyan hover:bg-glow-cyan/20 p-2 rounded-full transition-all duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-background border-t border-glow-cyan/30 px-4 py-4 absolute top-full left-0 w-full z-40 shadow-glow-md">
          <div className="flex flex-col space-y-4">
            {session ? (
              <>
                <span className="text-glow-cyan font-semibold text-center bg-glow-cyan/10 px-3 py-2 rounded-full shadow-inner">
                  Welcome, {session.user.firstName}
                </span>
                <Link
                  href="/dashboard"
                  className="text-text hover:text-glow-cyan hover:bg-glow-cyan/20 px-4 py-2 rounded-lg transition-all duration-300 text-center font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="text-text hover:text-glow-cyan hover:bg-glow-cyan/20 px-4 py-2 rounded-lg transition-all duration-300 text-center font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="text-text hover:text-glow-cyan hover:bg-glow-cyan/20 px-4 py-2 rounded-lg transition-all duration-300 text-center font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-text hover:text-glow-cyan hover:bg-glow-cyan/20 px-4 py-2 rounded-lg transition-all duration-300 text-center font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-text hover:text-glow-cyan hover:bg-glow-cyan/20 px-4 py-2 rounded-lg transition-all duration-300 text-center font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Signup
                </Link>
              </>
            )}
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="text-text hover:text-glow-cyan hover:bg-glow-cyan/20 px-4 py-2 rounded-lg transition-all duration-300 text-center font-medium"
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}