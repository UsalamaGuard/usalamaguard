"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import Navbar from "../components/navbar/page";
import EventCard from "../components/eventcard/page";
import { Bell, Filter, Video, ChevronLeft, ChevronRight } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [pendingNotification, setPendingNotification] = useState(null);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const lastScreenshotTime = useRef(0);
  const router = useRouter();

  // Use the backend URL from the environment variable
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
 }, [status, router]);

  // Socket connection with user-specific events
  const socket = io(backendUrl, {
    query: { userId: session?.user?.id },
  });

  useEffect(() => {
    if (!session) return;

    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/events`, {
          params: { userId: session.user.id },
        });
        setEvents(res.data);
        console.log("Initial events fetched:", res.data.length);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };
    fetchEvents();
  }, [session, backendUrl]);

  useEffect(() => {
    if (!session) return;

    socket.on(`new_event_${session.user.id}`, (newEvent) => {
      setEvents((prev) => [...prev, newEvent]);
      console.log("New event received:", {
        _id: newEvent._id,
        imagePreview: newEvent.image ? newEvent.image.slice(0, 50) + "..." : "N/A",
      });
      setTimeout(() => {
        setPendingNotification(`New ${newEvent.type} in ${newEvent.location}`);
      }, 60000);
    });

    socket.on(`event_updated_${session.user.id}`, (updatedEvent) => {
      setEvents((prev) =>
        prev.map((event) =>
          event._id === updatedEvent._id ? updatedEvent : event
        )
      );
      console.log("Event updated:", updatedEvent);
    });

    return () => {
      socket.off(`new_event_${session.user.id}`);
      socket.off(`event_updated_${session.user.id}`);
    };
  }, [session]);

  useEffect(() => {
    if (pendingNotification) {
      setNotifications((prev) => [...prev, pendingNotification]);
      setPendingNotification(null);
    }
  }, [pendingNotification]);

  useEffect(() => {
    if (isSoundOn && notifications.length > 0) {
      audioRef.current.play().catch((err) => console.error("Audio play error:", err));
    }
  }, [notifications, isSoundOn]);

  const updateEventStatus = async (eventId, newStatus) => {
    try {
      const res = await axios.patch(`${backendUrl}/api/events/${eventId}`, {
        status: newStatus,
      });
      setEvents((prev) =>
        prev.map((event) =>
          event._id === eventId ? res.data : event
        )
      );
      console.log("Status updated:", res.data);
    } catch (err) {
      console.error("Error updating event status:", err);
    }
  };

  const filteredEvents = events.filter((event) =>
    filter === "All" ? true : event.status === filter
  );
  const totalPages = Math.ceil(filteredEvents.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + cardsPerPage);

  const stats = {
    active: events.filter((e) => e.status === "Active").length,
    resolved: events.filter((e) => e.status === "Resolved").length,
    dismissed: events.filter((e) => e.status === "Dismissed").length,
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log("Camera stream loaded:", videoRef.current.videoWidth, videoRef.current.videoHeight);
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        console.log("Camera stream stopped");
      }
    };
  }, []);

  useEffect(() => {
    if (!session) return;

    const captureScreenshot = async () => {
      if (!videoRef.current || !videoRef.current.srcObject) {
        console.warn("Video stream not available for screenshot");
        return;
      }

      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 360;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");
      console.log("Screenshot captured:", {
        size: `${(imageData.length / 1024).toFixed(2)} KB`,
        preview: imageData.slice(0, 50) + "...",
      });

      try {
        const response = await axios.post(`${backendUrl}/api/events`, {
          userId: session.user.id,
          image: imageData,
          timestamp: new Date().toISOString(),
          type: "Motion Detected",
          location: "Gate A", // Replace with user’s cameraLocation if set
          status: "Active",
          severity: "Medium",
        });
        console.log("Screenshot sent to backend:", response.data._id);
        lastScreenshotTime.current = Date.now();
      } catch (err) {
        console.error("Error sending screenshot:", err.response?.data || err.message);
        setTimeout(captureScreenshot, 5000);
      }
    };

    const checkAndCapture = () => {
      const now = Date.now();
      if (now - lastScreenshotTime.current >= 60000) {
        captureScreenshot();
      }
    };

    const interval = setInterval(checkAndCapture, 10000);
    return () => clearInterval(interval);
  }, [session, backendUrl]);

  if (status === "loading") return <div>Loading...</div>;

  return (
    <div className="bg-background text-text min-h-screen">
      <Navbar />
      <section className="pt-28 pb-16 max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-6">Surveillance Dashboard</h1>
        <p className="text-center text-gray-300 mb-8">
          {session ? `Real-time motion detection events for ${session.user.email}` : ""}
        </p>

        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-glow-cyan/30 to-cosmic-purple/30 text-white px-6 py-3 rounded-full shadow-lg border border-glow-cyan/50 z-50 flex items-center space-x-2"
          >
            <Bell className="text-glow-cyan animate-pulse" size={20} />
            <span className="font-semibold">{notifications[notifications.length - 1]}</span>
            <button
              onClick={() => setNotifications([])}
              className="ml-4 text-sm text-gray-200 hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        <div className="mb-8 bg-card-bg rounded-2xl p-4 shadow-glow-md">
          <div className="flex items-center mb-2">
            <Video className="text-glow-cyan mr-2" size={24} />
            <h2 className="text-xl font-semibold">Live Feed</h2>
          </div>
          <div className="relative w-full h-64 sm:h-80 bg-background/50 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              muted
              width="100%"
              height="auto"
              className="w-full h-full object-cover"
            ></video>
            <div className="absolute top-2 right-2 bg-glow-cyan/20 text-glow-cyan px-2 py-1 rounded-full text-sm">
              Live
            </div>
          </div>
        </div>

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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedEvents.length === 0 ? (
            <p className="text-gray-400 text-center col-span-full">
              No events available for this filter.
            </p>
          ) : (
            paginatedEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                imageSrc={event.image}
                location={event.location}
                severity={event.severity}
                status={event.status}
                timestamp={event.timestamp}
                onUpdateStatus={updateEventStatus}
              />
            ))
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="p-2 bg-glow-cyan text-white rounded-full"
          >
            <ChevronLeft />
          </button>
          <span className="mx-4 text-lg">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="p-2 bg-glow-cyan text-white rounded-full"
          >
            <ChevronRight />
          </button>
        </div>
      </section>

      <audio ref={audioRef} src="/notification-sound.mp3" preload="auto" />
    </div>
  );
}