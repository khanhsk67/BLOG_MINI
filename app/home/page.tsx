"use client";
// DÒNG NÀY NÓI VỚI NEXT.JS:
// 👉 File này CHẠY TRÊN TRÌNH DUYỆT (client), KHÔNG chạy trên server
// Vì bên dưới có dùng localStorage, useState, useEffect

import { useEffect, useState } from "react";
// useState  : dùng để lưu trạng thái (biến thay đổi theo thời gian)
// useEffect: dùng để chạy code SAU khi trang hiển thị

import { useRouter } from "next/navigation";
// useRouter dùng để CHUYỂN TRANG (ví dụ: sang /login)

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import Feed from "@/components/feed";
import RightSidebar from "@/components/right-sidebar";
// Import các component giao diện (chỉ là chia nhỏ UI)

export default function HomePage() {
  // Lấy router để dùng chuyển trang
  const router = useRouter();

  // Biến kiểm tra: người dùng đã đăng nhập CHƯA
  // false = chưa đăng nhập
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Biến kiểm tra: đang chờ kiểm tra đăng nhập hay không
  // true = đang kiểm tra
  const [isLoading, setIsLoading] = useState(true);

  // useEffect sẽ chạy SAU khi trang được render ra màn hình
  useEffect(() => {
    // Lấy token đăng nhập đã lưu trong trình duyệt
    // Nếu bạn chưa đăng nhập bao giờ → token = null
    const token = localStorage.getItem("authToken");

    // NẾU KHÔNG CÓ TOKEN
    if (!token) {
      // 👉 đá người dùng về trang /login
      router.push("/login");
    }
    // NẾU CÓ TOKEN
    else {
      // 👉 đánh dấu là đã đăng nhập
      setIsAuthenticated(true);
    }

    // Dù có token hay không thì cũng kết thúc quá trình kiểm tra
    setIsLoading(false);
  }, [router]);
  // [router] nghĩa là: useEffect chỉ chạy khi router tồn tại (chuẩn React)

  // NẾU ĐANG KIỂM TRA ĐĂNG NHẬP
  if (isLoading) {
    // 👉 chỉ hiện chữ "Loading..."
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // NẾU CHƯA ĐĂNG NHẬP
  if (!isAuthenticated) {
    // 👉 không vẽ gì cả
    // (vì đã bị chuyển sang /login rồi)
    return null;
  }

  // ĐẾN ĐÂY TỨC LÀ:
  // ✔ Đã đăng nhập
  // ✔ Không còn loading
  // 👉 hiển thị giao diện chính
  return (
    <div className="min-h-screen bg-background">
      {/* Thanh trên cùng */}
      <Header />

      {/* Phần nội dung chính */}
      <main className="flex gap-6 px-4 pt-6 pb-12 max-w-7xl mx-auto">
        {/* Cột trái */}
        <Sidebar />

        {/* Nội dung chính */}
        <Feed />

        {/* Cột phải */}
        <RightSidebar />
      </main>
    </div>
  );
}
