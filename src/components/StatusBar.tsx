"use client";

import { useState, useEffect } from "react";

export default function StatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      );
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-[48px]">
      <span className="absolute left-6 top-[22px] -translate-y-1/2 text-xs font-semibold text-[#1d1d1f]" suppressHydrationWarning>{time}</span>

      <div className="absolute right-6 top-[22px] -translate-y-1/2 flex items-center">
        {/* Battery */}
        <svg
          width="28"
          height="12"
          viewBox="0 0 28 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.5"
            y="0.5"
            width="23"
            height="11"
            rx="2.5"
            stroke="#1d1d1f"
            strokeWidth="1"
          />
          <rect x="2" y="2" width="20" height="8" rx="1.5" fill="#1d1d1f" />
          <path
            d="M25 4v4a2 2 0 0 0 0-4Z"
            fill="#1d1d1f"
            opacity="0.4"
          />
        </svg>

      </div>
    </div>
  );
}
