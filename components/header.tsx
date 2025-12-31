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
import SearchBar from "@/components/search-bar";

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Remove cookies
    document.cookie = "authToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";

    // Remove localStorage (for backwards compatibility)
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");

    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        <div className="flex items-center gap-8 flex-1">
          <Link
            href="/home"
            className="text-2xl font-bold text-primary hover:opacity-80 transition flex-shrink-0"
          >
            MiniBlog
          </Link>
          <div className="hidden md:block flex-1 max-w-xl">
            <SearchBar placeholder="Search posts, users..." />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer hover:opacity-80 transition">
            <Bell className="w-5 h-5 text-foreground" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></span>
          </div>

          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <img
                src="/default-avatar.jpg"
                alt="User avatar"
                className="w-9 h-9 rounded-full object-cover cursor-pointer hover:opacity-90 transition"
              />
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