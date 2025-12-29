import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Các trang CÔNG KHAI (không cần đăng nhập)
  const isPublicPath = path === "/login" || path === "/signup" || path === "/";

  // Lấy token từ cookie
  const token = request.cookies.get("authToken")?.value;

  // ⭐ Nếu vào trang BẢO VỆ (như /home, /profile) mà KHÔNG có token
  // → Đá về /login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // ⭐ Nếu ĐÃ có token mà vào /login hoặc /signup
  // → Đá về /home
  if ((path === "/login" || path === "/signup") && token) {
    return NextResponse.redirect(new URL("/home", request.nextUrl));
  }

  // Cho phép request tiếp tục
  return NextResponse.next();
}

// Áp dụng middleware cho TẤT CẢ các routes (trừ file tĩnh)
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
