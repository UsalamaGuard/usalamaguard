"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar/page";
import ProtectedRoute from "../components/protected/page";
import EventCard from "../components/eventcard/page";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get("/api/events", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      setEvents(res.data);
    };
    if (session) {
      fetchEvents();
      const interval = setInterval(fetchEvents, 5000); // Poll every 5s
      return () => clearInterval(interval);
    }
  }, [session]);

  return (
    <ProtectedRoute>
      <div className="bg-space-black text-stellar-white min-h-screen">
        <Navbar />
        <section className="pt-24 pb-16 max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-center mb-6">Surveillance Dashboard</h1>
          <p className="text-center text-gray-300 mb-8">
            Real-time motion detection events for {session?.user.email}
          </p>
          <div className="grid gap-6">
            {events.length === 0 ? (
              <p className="text-gray-400 text-center">No events detected yet.</p>
            ) : (
              events.map((event, index) => (
                <EventCard key={index} timestamp={event.timestamp} image={event.image} />
              ))
            )}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}