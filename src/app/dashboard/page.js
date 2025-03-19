"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar/page";
import EventCard from "../components/eventcard/page";
import { Bell, Filter, Video, ChevronLeft, ChevronRight } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  // Ref for the audio element
  const audioRef = useRef(null);

  useEffect(() => {
    const mockEvents = [
      { timestamp: "2025-03-19T12:00:00Z", image: "https://via.placeholder.com/300x200?text=Event+1", type: "Motion Detected", location: "Front Door", status: "Active", severity: "medium" },
      { timestamp: "2025-03-19T12:05:00Z", image: "https://via.placeholder.com/300x200?text=Event+2", type: "Intruder Alert", location: "Backyard", status: "Resolved", severity: "high" },
      { timestamp: "2025-03-19T12:10:00Z", image: "https://via.placeholder.com/300x200?text=Event+3", type: "Noise Detected", location: "Garage", status: "Dismissed", severity: "low" },
      { timestamp: "2025-03-19T12:15:00Z", image: "https://via.placeholder.com/300x200?text=Event+4", type: "Motion Detected", location: "Kitchen", status: "Active", severity: "low" },
      { timestamp: "2025-03-19T12:20:00Z", image: "https://via.placeholder.com/300x200?text=Event+5", type: "Smoke Detected", location: "Living Room", status: "Active", severity: "high" },
      { timestamp: "2025-03-19T12:25:00Z", image: "https://via.placeholder.com/300x200?text=Event+6", type: "Noise Detected", location: "Bedroom", status: "Resolved", severity: "medium" },
      { timestamp: "2025-03-19T12:30:00Z", image: "https://via.placeholder.com/300x200?text=Event+7", type: "Motion Detected", location: "Garage", status: "Dismissed", severity: "low" },
    ];

    const addNewEvent = () => {
      const newEvent = {
        timestamp: new Date().toISOString(),
        image: "https://via.placeholder.com/300x200?text=New+Event",
        type: "Motion Detected",
        location: "Living Room",
        status: "Active",
        severity: "medium",
      };
      setEvents((prev) => [...prev, newEvent]);
      setNotifications((prev) => [...prev, "New motion detected in Living Room"]);
    };

    setEvents(mockEvents);
    const interval = setInterval(addNewEvent, 15000);
    return () => clearInterval(interval);
  }, []);

  // Play notification sound when a new notification is added
  useEffect(() => {
    if (isSoundOn && notifications.length > 0) {
      audioRef.current.play();
    }
  }, [notifications, isSoundOn]);

  // Filter events
  const filteredEvents = events.filter((event) =>
    filter === "All" ? true : event.status === filter
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredEvents.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + cardsPerPage);

  // Event summary stats
  const stats = {
    active: events.filter((e) => e.status === "Active").length,
    resolved: events.filter((e) => e.status === "Resolved").length,
    dismissed: events.filter((e) => e.status === "Dismissed").length,
  };

  return (
    <div className="bg-background text-text min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-6">Surveillance Dashboard</h1>
        <p className="text-center text-gray-300 mb-8">
          {session
            ? `Real-time motion detection events for ${session?.user.email}`
            : "Explore the UsalamaGuard Surveillance Dashboard"}
        </p>

        {/* Real-Time Surveillance Screen */}
        <div className="mb-8 bg-card-bg rounded-2xl p-4 shadow-glow-md">
          <div className="flex items-center mb-2">
            <Video className="text-glow-cyan mr-2" size={24} />
            <h2 className="text-xl font-semibold">Live Feed</h2>
          </div>
          <div className="relative w-full h-64 sm:h-80 bg-background/50 rounded-lg overflow-hidden">
            <img
              src="https://via.placeholder.com/640x360?text=Live+Surveillance"
              alt="Live Feed"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 bg-glow-cyan/20 text-glow-cyan px-2 py-1 rounded-full text-sm">
              Live
            </div>
          </div>
        </div>

        {/* Event Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card-bg p-4 rounded-xl shadow-glow-md text-center">
            <p className="text-glow-cyan font-semibold">Active</p>
            <p className="text-2xl">{stats.active}</p>
          </div>
          <div className="bg-card-bg p-4 rounded-xl shadow-glow-md text-center">
            <p className="text-green-400 font-semibold">Resolved</p>
            <p className="text-2xl">{stats.resolved}</p>
          </div>
          <div className="bg-card-bg p-4 rounded-xl shadow-glow-md text-center">
            <p className="text-gray-400 font-semibold">Dismissed</p>
            <p className="text-2xl">{stats.dismissed}</p>
          </div>
        </div>

        {/* Filter and Settings */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Filter className="text-glow-cyan" size={20} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-background border border-glow-cyan/30 text-text p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-glow-cyan"
            >
              <option value="All">All Events</option>
              <option value="Active">Active</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="text-glow-cyan" size={20} />
            <span>{notifications.length} New</span>
            <button
              onClick={() => setIsSoundOn(!isSoundOn)}
              className="text-glow-cyan hover:text-glow-cyan/80"
            >
              Sound {isSoundOn ? "On" : "Off"}
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedEvents.length === 0 ? (
            <p className="text-gray-400 text-center col-span-full">
              No events available for this filter.
            </p>
          ) : (
            paginatedEvents.map((event, index) => (
              <EventCard
                key={index}
                timestamp={event.timestamp}
                image={event.image}
                type={event.type}
                location={event.location}
                status={event.status}
                severity={event.severity}
              />
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="text-text hover:text-glow-cyan disabled:text-gray-500 transition-all duration-300 flex items-center"
            >
              <ChevronLeft size={20} />
              <span className="ml-1">Previous</span>
            </button>
            <span className="text-text">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="text-text hover:text-glow-cyan disabled:text-gray-500 transition-all duration-300 flex items-center"
            >
              <span className="mr-1">Next</span>
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Notifications Popup */}
        {notifications.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-card-bg p-4 rounded-xl shadow-glow-md border border-glow-cyan/30 max-w-xs">
            <h3 className="text-lg font-semibold mb-2 text-text">Notifications</h3>
            <ul className="space-y-2 text-sm text-text">
              {notifications.slice(-3).map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
            <button
              onClick={() => setNotifications([])}
              className="mt-2 text-glow-cyan hover:text-glow-cyan/80"
            >
              Clear
            </button>
          </div>
        )}

        {/* Audio element for notification tone */}
        <audio ref={audioRef} src="/notification.wav" preload="auto" />
      </section>
    </div>
  );
}