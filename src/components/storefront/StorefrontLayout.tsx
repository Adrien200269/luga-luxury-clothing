"use client";

import React from "react";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "./CartDrawer";
import { SearchDrawer } from "./SearchDrawer";
import { ScrollProgressBar } from "@/components/common/ScrollProgressBar";
import { ScrollToTop } from "@/components/common/ScrollToTop";

export const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-luga-bg dark:bg-luga-darkBg text-luga-ink dark:text-luga-darkInk selection:bg-luga-crimson selection:text-white dark:selection:bg-luga-gold dark:selection:text-black relative">
      <ScrollProgressBar />
      <AnnouncementBar />
      <Header />
      <SearchDrawer />
      <CartDrawer />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};
