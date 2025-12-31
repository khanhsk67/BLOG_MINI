"use client";

// Import các thư viện cần thiết
import { useState } from "react"; // Hook để quản lý state
import { useRouter } from "next/navigation"; // Hook để điều hướng trang
import Link from "next/link"; // Component Link của Next.js
import { Button } from "@/components/ui/button"; // Component Button
import { Input } from "@/components/ui/input"; // Component Input

export default function LoginPage() {
  const router = useRouter(); // Khởi tạo router để chuyển hướng sau khi login

  // State quản lý các input và trạng thái form
  const [email, setEmail] = useState(""); // Email người dùng nhập
  const [password, setPassword] = useState(""); // Mật khẩu người dùng nhập
  const [error, setError] = useState(""); // Thông báo lỗi (nếu có)
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi đang xử lý login

  // Hàm xử lý khi submit form login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn chặn form submit mặc định (reload trang)
    setError(""); // Reset thông báo lỗi
    setIsLoading(true); // Bật trạng thái loading

    try {
      // Gọi API đăng nhập
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // Gửi email và password lên server
      });

      // Kiểm tra nếu response không thành công
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || "Login failed");
      }

      const data = await response.json(); // Parse response data

      // ⭐ LƯU TOKEN VÀO COOKIE (thay vì localStorage)
      // Lưu access token với thời hạn 7 ngày
      document.cookie = `authToken=${
        data.tokens.access_token
      }; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;

      // Lưu refresh token với thời hạn 30 ngày
      document.cookie = `refreshToken=${
        data.tokens.refresh_token
      }; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Strict`;

      // ⭐ LƯU TOKEN VÀO LOCALSTORAGE (để lấy user ID cho permission checks)
      localStorage.setItem('token', data.tokens.access_token);

      // ⭐ Chuyển hướng đến trang /home sau khi đăng nhập thành công
      router.push("/home");
    } catch (err) {
      // Xử lý lỗi và hiển thị thông báo
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false); // Tắt trạng thái loading
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card chứa form login */}
        <div className="bg-card rounded-xl shadow-lg p-8 border border-border">
          {/* Logo và Branding */}
          <div className="text-center mb-8">
            {/* Icon logo */}
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
              <span className="text-lg font-bold text-primary-foreground">
                MB
              </span>
            </div>
            {/* Tên app */}
            <h1 className="text-3xl font-bold text-foreground mb-2">MiniBlo</h1>
            {/* Slogan */}
            <p className="text-muted-foreground">
              Share your stories with the world
            </p>
          </div>

          {/* Form đăng nhập */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Input Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Cập nhật state khi input thay đổi
                required // Bắt buộc nhập
                className="w-full"
              />
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Cập nhật state khi input thay đổi
                required // Bắt buộc nhập
                className="w-full"
              />
            </div>

            {/* Hiển thị thông báo lỗi (nếu có) */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Nút Submit */}
            <Button
              type="submit"
              disabled={isLoading} // Disable khi đang loading
              className="w-full bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Đường phân cách */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-card text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Nút đăng nhập bằng mạng xã hội */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button variant="outline" className="w-full">
              Google
            </Button>
            <Button variant="outline" className="w-full">
              GitHub
            </Button>
          </div>

          {/* Link đến trang đăng ký */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-primary hover:text-primary/90 transition"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Thông tin tài khoản demo để test */}
        <div className="mt-6 p-4 bg-card/50 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            Demo: user@example.com / SecurePass123!
          </p>
        </div>
      </div>
    </div>
  );
}
