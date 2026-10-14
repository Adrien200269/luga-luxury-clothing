"use client";

import React, { useEffect, useState } from "react";

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const currentScroll = window.scrollY;
      const progress = Math.min(Math.max((currentScroll / totalHeight) * 100, 0), 100);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 h-[2.5px] z-50 pointer-events-none bg-transparent">
      <div
        className="h-full bg-luga-crimson dark:bg-luga-gold transition-all duration-150 ease-out"
        style={{
          width: `${scrollProgress}%`,
          opacity: scrollProgress > 1 ? 1 : 0,
        }}
      />
    </div>
  );
};
