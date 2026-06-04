"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    // Only run once per page load
    const ping = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: window.location.pathname,
            referrer: document.referrer || "",
          }),
        });
      } catch {
        // Silently fail — tracking should never break the site
      }
    };

    // Small delay so it doesn't compete with critical resources
    const timer = setTimeout(ping, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Renders nothing — invisible tracker
  return null;
}
