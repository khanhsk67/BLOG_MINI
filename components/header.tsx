"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Menu, LogOut, Settings, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationDropdown from "@/components/notification-dropdown";

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults(null);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
    setShowResults(false);
  };

  const handleResultClick = () => {
    setShowResults(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    document.cookie = "authToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
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

          {/* Search with Dropdown Results */}
          <div className="hidden md:block relative" ref={searchRef}>
            <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2 w-64">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts, people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                className="border-0 bg-transparent outline-none text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {searchQuery && (
                <X
                  className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground"
                  onClick={handleClearSearch}
                />
              )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults && (
              <div className="absolute top-full mt-2 w-96 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {/* Users Results */}
                {searchResults.users && searchResults.users.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-muted-foreground px-3 py-2">
                      USERS
                    </h3>
                    {searchResults.users.map((user: any) => (
                      <Link
                        key={user.id}
                        href={`/profile?username=${user.username}`}
                        onClick={handleResultClick}
                      >
                        <div className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg cursor-pointer">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Posts Results */}
                {searchResults.posts && searchResults.posts.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-muted-foreground px-3 py-2">
                      POSTS
                    </h3>
                    {searchResults.posts.map((post: any) => (
                      <Link
                        key={post.id}
                        href={`/posts/${post.id}`}
                        onClick={handleResultClick}
                      >
                        <div className="p-3 hover:bg-muted rounded-lg cursor-pointer">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={post.author.avatar} alt={post.author.name} />
                              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-semibold">{post.author.name}</span>
                          </div>
                          <p className="text-sm line-clamp-2">{post.content}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {(!searchResults.users || searchResults.users.length === 0) &&
                  (!searchResults.posts || searchResults.posts.length === 0) && (
                    <div className="p-8 text-center text-muted-foreground">
                      <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No results found for "{searchQuery}"</p>
                    </div>
                  )}
              </div>
            )}

            {/* Loading State */}
            {isSearching && showResults && (
              <div className="absolute top-full mt-2 w-96 bg-card border border-border rounded-lg shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Searching...</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Dropdown */}
          <NotificationDropdown />

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