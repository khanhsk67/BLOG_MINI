"use client";

import { useState } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Users, UserPlus, UserCheck, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data cho người đang follow
const followingUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    username: "@sarahchen",
    avatar: "SC",
    bio: "Product Designer & UX Enthusiast. Building beautiful digital experiences.",
    followers: "245K",
    posts: 342,
    coverImage:
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=200&fit=crop",
    isFollowing: true,
    tags: ["Design", "UX", "Product"],
  },
  {
    id: 2,
    name: "Marcus Johnson",
    username: "@marcusj",
    avatar: "MJ",
    bio: "Full Stack Developer | Open Source Contributor | Coffee addict ☕",
    followers: "189K",
    posts: 567,
    coverImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=200&fit=crop",
    isFollowing: true,
    tags: ["Development", "React", "Node.js"],
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    username: "@elenrod",
    avatar: "ER",
    bio: "Tech Writer | Explaining complex tech in simple words 📝",
    followers: "156K",
    posts: 428,
    coverImage:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=200&fit=crop",
    isFollowing: true,
    tags: ["Writing", "Technology", "Education"],
  },
  {
    id: 4,
    name: "David Kim",
    username: "@davidkim",
    avatar: "DK",
    bio: "AI Researcher | Machine Learning | Stanford PhD 🎓",
    followers: "298K",
    posts: 215,
    coverImage:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=200&fit=crop",
    isFollowing: true,
    tags: ["AI", "ML", "Research"],
  },
];

// Suggested users to follow
const suggestedUsers = [
  {
    id: 5,
    name: "Lisa Park",
    username: "@lisapark",
    avatar: "LP",
    bio: "Startup Founder | Building the future of education",
    followers: "87K",
    isFollowing: false,
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    username: "@ahmedh",
    avatar: "AH",
    bio: "Mobile Developer | iOS & Android",
    followers: "125K",
    isFollowing: false,
  },
  {
    id: 7,
    name: "Sophie Williams",
    username: "@sophiew",
    avatar: "SW",
    bio: "Data Scientist | Python enthusiast 🐍",
    followers: "103K",
    isFollowing: false,
  },
];

export default function FollowingPage() {
  const [following, setFollowing] = useState(followingUsers);
  const [suggested, setSuggested] = useState(suggestedUsers);
  const [searchQuery, setSearchQuery] = useState("");

  const handleUnfollow = (userId: number) => {
    setFollowing(following.filter((user) => user.id !== userId));
  };

  const handleFollow = (userId: number) => {
    const userToFollow = suggested.find((user) => user.id === userId);
    if (userToFollow) {
      setSuggested(suggested.filter((user) => user.id !== userId));
    }
  };

  const filteredFollowing = following.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex gap-6 px-4 pt-6 pb-12 max-w-7xl mx-auto">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 max-w-4xl space-y-6">
          {/* Page Header */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 mb-2">
                  <Users className="w-8 h-8 text-accent" />
                  Following
                </h1>
                <p className="text-muted-foreground">
                  You're following {following.length} amazing people
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <Input
              type="text"
              placeholder="Search people you follow..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-4"
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-foreground mb-1">
                {following.length}
              </p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-foreground mb-1">1.2M</p>
              <p className="text-sm text-muted-foreground">Total Reach</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-foreground mb-1">1,552</p>
              <p className="text-sm text-muted-foreground">Total Posts</p>
            </div>
          </div>

          {/* Following List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              People You Follow
            </h2>

            {filteredFollowing.length > 0 ? (
              filteredFollowing.map((user) => (
                <div
                  key={user.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  {/* Cover Image */}
                  <div
                    className="h-24 bg-cover bg-center"
                    style={{ backgroundImage: `url(${user.coverImage})` }}
                  />

                  {/* User Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-16 h-16 -mt-12 rounded-full bg-accent border-4 border-card flex items-center justify-center text-xl font-bold text-accent-foreground">
                          {user.avatar}
                        </div>

                        {/* Name & Bio */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-foreground">
                            {user.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {user.username}
                          </p>
                          <p className="text-sm text-foreground mb-3">
                            {user.bio}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            {user.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        variant="outline"
                        onClick={() => handleUnfollow(user.id)}
                        className="gap-2"
                      >
                        <UserCheck className="w-4 h-4" />
                        Following
                      </Button>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="font-semibold text-foreground">
                          {user.followers}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          followers
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">
                          {user.posts}
                        </span>
                        <span className="text-muted-foreground ml-1">
                          posts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  No results found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-80 space-y-4">
          {/* Suggested Users */}
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Suggested For You
            </h3>

            <div className="space-y-4">
              {suggested.map((user) => (
                <div key={user.id} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-sm font-bold text-accent-foreground flex-shrink-0">
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm truncate">
                      {user.name}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate mb-1">
                      {user.username}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {user.bio}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => handleFollow(user.id)}
                      className="w-full bg-accent hover:bg-accent/90 text-xs gap-1"
                    >
                      <UserPlus className="w-3 h-3" />
                      Follow
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Trending Topics
            </h3>
            <div className="space-y-3">
              {["#WebDevelopment", "#Design", "#AI", "#Startup"].map((tag) => (
                <div
                  key={tag}
                  className="p-2 hover:bg-secondary rounded-lg transition cursor-pointer"
                >
                  <p className="font-semibold text-accent text-sm">{tag}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.floor(Math.random() * 20)}k posts
                  </p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
