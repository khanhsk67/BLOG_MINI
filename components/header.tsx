"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import {
  Search,
  Menu,
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationDropdown from "@/components/notification-dropdown";

export default function Header() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  /* ---------------- Click outside search ---------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- Debounced search ---------------- */
  useEffect(() => {
    const delay = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults(null);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.results);
        setShowResults(true);
      }
    } catch (err) {
      console.error("Search failed:", err);
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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* ---------------- Left ---------------- */}
        <div className="flex items-center gap-8">
          <Link
            href="/home"
            className="text-2xl font-bold text-primary hover:opacity-80 transition"
          >
            MiniBlog
          </Link>

          {/* ---------------- Search ---------------- */}
          <div
            ref={searchRef}
            className="hidden md:block relative"
          >
            <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2 w-64">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowResults(true)}
                placeholder="Search posts, people..."
                className="border-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {searchQuery && (
                <X
                  className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={handleClearSearch}
                />
              )}
            </div>

            {/* Results */}
            {showResults && searchResults && (
              <div className="absolute top-full mt-2 w-96 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                {/* Users */}
                {searchResults.users?.length > 0 && (
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
                        <div className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Posts */}
                {searchResults.posts?.length > 0 && (
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
                        <div className="p-3 hover:bg-muted rounded-lg">
                          <p className="text-sm line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {!searchResults.users?.length &&
                  !searchResults.posts?.length && (
                    <div className="p-6 text-center text-muted-foreground">
                      No results found for "{searchQuery}"
                    </div>
                  )}
              </div>
            )}

            {isSearching && showResults && (
              <div className="absolute top-full mt-2 w-96 bg-card border rounded-lg p-6 text-center">
                <div className="animate-spin h-6 w-6 border-b-2 border-primary mx-auto" />
                <p className="text-sm text-muted-foreground mt-2">
                  Searching...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ---------------- Right ---------------- */}
        <div className="flex items-center gap-4">
          <NotificationDropdown />

          {/* Just the Avatar, no Menu */}
          <Avatar>
            <AvatarImage src="/default-avatar.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>

          <Menu className="md:hidden w-5 h-5 cursor-pointer" />
        </div>
      </div>
    </header>
  );
}