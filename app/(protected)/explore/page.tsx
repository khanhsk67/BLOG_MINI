"use client";

import { useState } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Search, TrendingUp, Sparkles, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock data
const trendingPosts = [
  {
    id: 1,
    title: "10 Tips for Better Code Quality",
    author: "Alex Johnson",
    avatar: "AJ",
    reads: "12.5k",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop",
    tags: ["programming", "tips"],
  },
  {
    id: 2,
    title: "The Rise of AI in 2025",
    author: "Maria Garcia",
    avatar: "MG",
    reads: "8.9k",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    tags: ["ai", "technology"],
  },
  {
    id: 3,
    title: "UX Design Principles That Matter",
    author: "Chen Wei",
    avatar: "CW",
    reads: "6.2k",
    image:
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop",
    tags: ["design", "ux"],
  },
];

const categories = [
  { name: "Technology", icon: "💻", posts: "15.2k" },
  { name: "Design", icon: "🎨", posts: "8.9k" },
  { name: "Business", icon: "💼", posts: "12.5k" },
  { name: "Health", icon: "🏥", posts: "6.3k" },
  { name: "Travel", icon: "✈️", posts: "9.8k" },
  { name: "Food", icon: "🍔", posts: "11.2k" },
];

const featuredWriters = [
  {
    name: "Sarah Johnson",
    username: "@sarahj",
    avatar: "SJ",
    followers: "125k",
    bio: "Tech writer & AI enthusiast",
  },
  {
    name: "Mike Chen",
    username: "@mikechen",
    avatar: "MC",
    followers: "98k",
    bio: "Product Designer",
  },
  {
    name: "Emma Wilson",
    username: "@emmaw",
    avatar: "EW",
    followers: "87k",
    bio: "Startup founder",
  },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "people" | "tags">(
    "posts"
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex gap-6 px-4 pt-6 pb-12 max-w-7xl mx-auto">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 max-w-3xl space-y-6">
          {/* Search Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h1 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-accent" />
              Explore MiniBlog
            </h1>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts, people, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 text-base"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-border">
              <button
                onClick={() => setActiveTab("posts")}
                className={`pb-3 px-2 font-medium transition ${
                  activeTab === "posts"
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab("people")}
                className={`pb-3 px-2 font-medium transition ${
                  activeTab === "people"
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                People
              </button>
              <button
                onClick={() => setActiveTab("tags")}
                className={`pb-3 px-2 font-medium transition ${
                  activeTab === "tags"
                    ? "text-accent border-b-2 border-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tags
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === "posts" && (
            <>
              {/* Trending Posts */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Trending Posts
                </h2>

                {trendingPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
                  >
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-40 h-28 object-cover rounded-lg"
                      />

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-2 hover:text-accent transition">
                          {post.title}
                        </h3>

                        {/* Author Info */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                            {post.avatar}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {post.author}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            • {post.reads} reads
                          </span>
                        </div>

                        {/* Tags */}
                        <div className="flex gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Categories */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Browse by Category
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      className="flex items-center gap-3 p-4 bg-secondary rounded-lg hover:bg-accent/10 hover:border-accent border border-transparent transition"
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">
                          {category.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category.posts} posts
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "people" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Featured Writers
              </h2>

              {featuredWriters.map((writer) => (
                <div
                  key={writer.username}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-xl font-bold text-accent-foreground">
                        {writer.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-lg">
                          {writer.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {writer.username}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {writer.bio}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {writer.followers} followers
                        </p>
                      </div>
                    </div>
                    <Button className="bg-accent hover:bg-accent/90">
                      Follow
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "tags" && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Popular Tags
              </h2>
              <div className="flex flex-wrap gap-3">
                {[
                  "#javascript",
                  "#react",
                  "#webdev",
                  "#design",
                  "#programming",
                  "#css",
                  "#python",
                  "#ai",
                  "#machinelearning",
                  "#startup",
                  "#productivity",
                  "#career",
                ].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-2 bg-accent/10 text-accent rounded-full hover:bg-accent hover:text-accent-foreground transition font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Optional suggestions */}
        <aside className="hidden xl:block w-80 space-y-4">
          <div className="bg-card border border-border rounded-lg p-4 sticky top-24">
            <h3 className="font-bold text-foreground mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use search to find specific topics</li>
              <li>• Follow writers you love</li>
              <li>• Explore new categories daily</li>
              <li>• Save posts for later reading</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
