"use client";

import React, { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const NavigationBar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  // When pathname or search params update, complete the navigation bar
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  // Intercept internal link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links, mailto, tel, hashes, new tabs
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        target.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      // Check if navigating to the exact same URL
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      // Start navigation indicator
      setIsNavigating(true);
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[9999] h-[2px] bg-transparent pointer-events-none overflow-hidden">
      <div className="h-full bg-gradient-to-r from-luga-crimson via-luga-gold to-luga-crimson w-full animate-laser-sweep" />
    </div>
  );
};

export const RouteLoadingIndicator: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <NavigationBar />
    </Suspense>
  );
};
