"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Bell, Menu, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // ⭐ THAY ĐỔI: Xóa cookie thay vì localStorage
    document.cookie = "authToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";

    // Xóa localStorage cũ (nếu còn)
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");

    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-8">
          <Link
            href="/home"
            className="text-2xl font-bold text-primary hover:opacity-80 transition"
          >
            MiniBlog
          </Link>
          <div className="hidden md:flex items-center gap-2 bg-secondary rounded-full px-4 py-2 w-64">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search posts, people..."
              className="border-0 bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer hover:opacity-80 transition">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
          </div>

          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <button className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:opacity-90 transition font-semibold text-sm">
                JD
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Menu className="md:hidden w-5 h-5 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}
