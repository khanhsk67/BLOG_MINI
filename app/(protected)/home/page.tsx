"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import Feed from "@/components/feed";
import RightSidebar from "@/components/right-sidebar";

export default function HomePage() {
  // ⭐ BỎ HẾT useEffect và useState
  // Vì middleware.ts đã kiểm tra cookie rồi!
  // Nếu không có cookie → middleware tự động redirect về /login

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex gap-6 px-4 pt-6 pb-12 max-w-7xl mx-auto">
        <Sidebar />
        <Feed />
        <RightSidebar />
      </main>
    </div>
  );
}
