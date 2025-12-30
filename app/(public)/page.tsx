"use client";

// Import các thư viện cần thiết
import { useEffect, useState } from "react"; // Hook để quản lý state và side effects
import { useRouter } from "next/navigation"; // Hook để điều hướng trang trong Next.js
import Link from "next/link"; // Component Link của Next.js để điều hướng client-side
import { Button } from "@/components/ui/button"; // Component Button tùy chỉnh
import { ArrowRight, Pen, Heart, Users, Zap } from "lucide-react"; // Các icon từ thư viện lucide-react

// Component chính của trang Landing Page
export default function LandingPage() {
  // Hook router để điều hướng đến các trang khác
  const router = useRouter();

  // State để kiểm tra người dùng đã đăng nhập chưa
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect chạy khi component được mount
  useEffect(() => {
    // Thay vì check localStorage
    // Gọi API để verify session/token từ cookie
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          credentials: "include", // Gửi cookie lên server
        });
        if (res.ok) {
          setIsAuthenticated(true);
          router.push("/home");
        }
      } catch (error) {
        console.error("Auth check failed");
      }
    };

    checkAuth();
  }, [router]);

  // Nếu đã đăng nhập, không hiển thị gì (sẽ redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ==================== NAVIGATION BAR ==================== */}
      {/* Header cố định ở đầu trang với hiệu ứng blur */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo và tên website */}
          <div className="flex items-center gap-2">
            {/* Icon logo */}
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Pen className="w-6 h-6 text-primary-foreground" />
            </div>
            {/* Tên website */}
            <span className="text-xl font-bold text-foreground">MiniBlog</span>
          </div>

          {/* Các nút đăng nhập và đăng ký */}
          <div className="flex items-center gap-3">
            {/* Nút Sign In - dẫn đến trang login */}
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            {/* Nút Get Started - dẫn đến trang đăng ký */}
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      {/* Phần giới thiệu chính với tiêu đề lớn và mô tả */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Tiêu đề chính */}
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Share Your Stories,{" "}
            <span className="text-primary">Connect with Others</span>
          </h1>

          {/* Mô tả phụ */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            MiniBlog is a modern platform where you can write, share, and
            discover amazing stories from people around the world.
          </p>

          {/* Các nút call-to-action */}
          <div className="flex gap-4 justify-center pt-6">
            {/* Nút chính: Start Writing */}
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 gap-2"
              >
                Start Writing <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            {/* Nút phụ: Learn More */}
            <Link href="/login">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      {/* Phần giới thiệu các tính năng chính */}
      <section className="py-16 px-4 bg-secondary/50">
        <div className="max-w-7xl mx-auto">
          {/* Tiêu đề section */}
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose MiniBlog?
          </h2>

          {/* Grid 3 cột hiển thị các tính năng */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Easy Writing */}
            <div className="bg-card p-6 rounded-lg border border-border text-center space-y-3">
              {/* Icon tính năng */}
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Pen className="w-6 h-6 text-primary" />
              </div>
              {/* Tiêu đề tính năng */}
              <h3 className="text-lg font-semibold text-foreground">
                Easy Writing
              </h3>
              {/* Mô tả tính năng */}
              <p className="text-sm text-muted-foreground">
                Intuitive editor that gets out of your way, so you can focus on
                writing great content.
              </p>
            </div>

            {/* Feature 2: Engage & Interact */}
            <div className="bg-card p-6 rounded-lg border border-border text-center space-y-3">
              {/* Icon tính năng */}
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              {/* Tiêu đề tính năng */}
              <h3 className="text-lg font-semibold text-foreground">
                Engage & Interact
              </h3>
              {/* Mô tả tính năng */}
              <p className="text-sm text-muted-foreground">
                Like, comment, and share stories with a vibrant community of
                writers and readers.
              </p>
            </div>

            {/* Feature 3: Build Community */}
            <div className="bg-card p-6 rounded-lg border border-border text-center space-y-3">
              {/* Icon tính năng */}
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              {/* Tiêu đề tính năng */}
              <h3 className="text-lg font-semibold text-foreground">
                Build Community
              </h3>
              {/* Mô tả tính năng */}
              <p className="text-sm text-muted-foreground">
                Follow your favorite writers and grow your audience with quality
                content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      {/* Phần kêu gọi hành động cuối cùng */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center bg-card border border-border rounded-lg p-12 space-y-6">
          {/* Icon nổi bật */}
          <Zap className="w-12 h-12 text-primary mx-auto" />
          {/* Tiêu đề CTA */}
          <h2 className="text-2xl font-bold text-foreground">
            Ready to Start Your Journey?
          </h2>
          {/* Mô tả CTA */}
          <p className="text-muted-foreground">
            Join thousands of writers sharing their stories and ideas every day.
          </p>
          {/* Nút tạo tài khoản */}
          <Link href="/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      {/* Phần chân trang với thông tin bản quyền */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MiniBlog. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
