"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, MapPin, AlertCircle, CheckCircle, XCircle, X } from "lucide-react";

export default function EventCard({
  event = {}, // Default to empty object if undefined
  imageSrc = "", // Default to empty string
  location = "Unknown Location", // Default fallback
  severity = "medium", // Default severity
  status = "Active", // Default status
  timestamp = new Date().toISOString(), // Default to current time
  onUpdateStatus = () => {}, // Default to no-op function
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Safely access event.type with fallback
  const eventType = event?.type || "Unknown Type";

  const severityStyles = {
    low: "bg-glow-cyan/20 text-glow-cyan border-glow-cyan/50",
    medium: "bg-cosmic-purple/20 text-cosmic-purple border-cosmic-purple/50",
    high: "bg-dark-matter/20 text-text border-dark-matter/50",
  };

  const statusIcons = {
    Active: <AlertCircle className="text-glow-cyan" size={20} />,
    Resolved: <CheckCircle className="text-green-400" size={20} />,
    Dismissed: <XCircle className="text-gray-400" size={20} />,
  };

  const handleViewDetails = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const handleResolve = () => {
    if (status !== "Resolved") {
      onUpdateStatus(event._id || "unknown-id", "Resolved"); // Fallback for event._id
    }
  };

  const handleDismiss = () => {
    if (status !== "Dismissed") {
      onUpdateStatus(event._id || "unknown-id", "Dismissed"); // Fallback for event._id
    }
  };

  return (
    <>
      {/* Event Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-card-bg rounded-2xl shadow-glow-md hover:shadow-glow-lg transition-all duration-300 border border-glow-cyan/20"
      >
        {/* Header: Event Type and Severity */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Zap className="text-glow-cyan mr-2" size={20} />
            <span className="text-text font-semibold">{eventType}</span>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded-full border ${severityStyles[severity] || severityStyles.medium}`}
          >
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </span>
        </div>

        {/* Image */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Captured Event"
            className="mt-2 rounded-lg max-w-full h-48 object-cover"
          />
        )}

        {/* Details */}
        <div className="mt-4 space-y-2 text-text">
          <div className="flex items-center">
            <span className="text-sm">Time:</span>
            <span className="ml-2">{new Date(timestamp).toLocaleString()}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2" size={16} />
            <span className="text-sm">{location}</span>
          </div>
          <div className="flex items-center">
            {statusIcons[status] || statusIcons.Active}
            <span className="ml-2 text-sm">{status}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={handleViewDetails}
            className="btn-futuristic text-sm px-4 py-2"
          >
            View Details
          </button>
          {status === "Active" && (
            <>
              <button
                onClick={handleResolve}
                className="text-glow-cyan hover:text-glow-cyan/80 transition-all duration-300 text-sm"
              >
                Mark as Resolved
              </button>
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-gray-300 transition-all duration-300 text-sm"
              >
                Dismiss
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto"
          onClick={handleClosePopup}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-card-bg p-4 sm:p-6 rounded-2xl shadow-glow-lg border border-glow-cyan/30 w-full max-w-[90vw] sm:max-w-md md:max-w-lg mx-4 my-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-text">{eventType} Details</h2>
              <button onClick={handleClosePopup} className="text-text hover:text-glow-cyan">
                <X size={24} />
              </button>
            </div>

            {/* Image */}
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Captured Event"
                className="w-full h-40 sm:h-64 object-cover rounded-lg mb-4"
              />
            )}

            {/* Detailed Information */}
            <div className="space-y-3 text-text text-sm sm:text-base">
              <p>
                <span className="font-semibold text-text">Timestamp:</span>{" "}
                {new Date(timestamp).toLocaleString()}
              </p>
              <p>
                <span className="font-semibold text-text">Type:</span> {eventType}
              </p>
              <p>
                <span className="font-semibold text-text">Location:</span> {location}
              </p>
              <p>
                <span className="font-semibold text-text">Status:</span>{" "}
                <span className="inline-flex items-center">
                  {statusIcons[status] || statusIcons.Active} {status}
                </span>
              </p>
              <p>
                <span className="font-semibold text-text">Severity:</span>{" "}
                <span
                  className={`${severityStyles[severity] || severityStyles.medium} px-2 py-1 rounded-full border text-xs sm:text-sm`}
                >
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </span>
              </p>
              <p>
                <span className="font-semibold text-text">Camera ID:</span> CAM-001
              </p>
              <p>
                <span className="font-semibold text-text">Notes:</span> Suspicious movement detected near entrance.
              </p>
            </div>

            {/* Close Button */}
            <div className="mt-4 sm:mt-6 flex justify-end">
              <button
                onClick={handleClosePopup}
                className="btn-futuristic text-sm px-3 py-2 sm:px-4 sm:py-2"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}