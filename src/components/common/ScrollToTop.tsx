"use client";

import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export const ScrollToTop: React.FC = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 450);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      className={`fixed bottom-6 right-6 z-40 p-3 bg-luga-bg dark:bg-[#141414] text-luga-ink dark:text-luga-darkInk border border-luga-border dark:border-luga-darkBorder hover:border-luga-crimson dark:hover:border-luga-gold hover:text-luga-crimson dark:hover:text-luga-gold shadow-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase ${
        showButton
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">TOP</span>
    </button>
  );
};
