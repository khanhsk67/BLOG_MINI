"use client";

import { Home, BookmarkIcon, Users, Compass, Settings } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { icon: Home, label: "Home", href: "/home" },
  { icon: Compass, label: "Explore", href: "/explore" },
  { icon: BookmarkIcon, label: "Saved", href: "/saved" },
  { icon: Users, label: "Following", href: "/following" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-64 h-fit sticky top-24">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary text-foreground transition group"
          >
            <item.icon className="w-5 h-5 group-hover:text-primary transition" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
