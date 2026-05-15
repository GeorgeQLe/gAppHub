"use client";

import { useState, useRef, useEffect } from "react";

interface SearchOverlayProps {
  onSearch: (term: string) => void;
  onDismiss: () => void;
  visible: boolean;
}

export default function SearchOverlay({
  onSearch,
  onDismiss,
  visible,
}: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) {
      setSearchTerm("");
      onSearch("");
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [visible, onSearch]);

  const handleChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onDismiss();
  };

  return (
    <div
      className={`absolute inset-x-0 top-0 z-20 transition-all duration-300 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 h-screen"
        onClick={onDismiss}
        aria-hidden
      />
      <div className="relative px-4 pt-3 pb-2">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search apps..."
          aria-label="Search apps"
          className="w-full h-9 px-3 text-sm text-black placeholder:text-black/40 bg-white/80 backdrop-blur-[10px] rounded-xl outline-none"
        />
      </div>
    </div>
  );
}
