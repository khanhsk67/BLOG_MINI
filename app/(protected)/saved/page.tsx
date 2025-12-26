"use client";

import { useState } from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Bookmark, Filter, Clock, Star, Folder, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data cho bài viết đã lưu
const savedPosts = [
  {
    id: 1,
    title: "Complete Guide to React Server Components",
    author: "John Doe",
    avatar: "JD",
    excerpt:
      "Everything you need to know about React Server Components in Next.js 14...",
    image:
      "https://images.unsplash.com/photo-1633356713697-d5daa3b83203?w=600&h=400&fit=crop",
    savedDate: "2 days ago",
    readTime: "8 min read",
    tags: ["react", "nextjs", "web-development"],
    collection: "Web Development",
  },
  {
    id: 2,
    title: "Design Systems: Building Better Products",
    author: "Sarah Chen",
    avatar: "SC",
    excerpt:
      "Learn how to create scalable design systems that actually work for your team...",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    savedDate: "5 days ago",
    readTime: "12 min read",
    tags: ["design", "ui-ux"],
    collection: "Design",
  },
  {
    id: 3,
    title: "The Future of AI in Software Development",
    author: "Alex Johnson",
    avatar: "AJ",
    excerpt:
      "How artificial intelligence is transforming the way we write code...",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    savedDate: "1 week ago",
    readTime: "10 min read",
    tags: ["ai", "technology", "programming"],
    collection: "Technology",
  },
  {
    id: 4,
    title: "10 TypeScript Tips for Better Code",
    author: "Emma Wilson",
    avatar: "EW",
    excerpt:
      "Practical TypeScript tips that will make your code more maintainable...",
    image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop",
    savedDate: "2 weeks ago",
    readTime: "6 min read",
    tags: ["typescript", "javascript", "programming"],
    collection: "Web Development",
  },
];

const collections = [
  { name: "All Saved", count: 42, icon: Bookmark },
  { name: "Web Development", count: 15, icon: Folder },
  { name: "Design", count: 12, icon: Folder },
  { name: "Technology", count: 8, icon: Folder },
  { name: "Career", count: 7, icon: Folder },
];

export default function SavedPage() {
  const [activeCollection, setActiveCollection] = useState("All Saved");
  const [savedItems, setSavedItems] = useState(savedPosts);

  const handleUnsave = (postId: number) => {
    setSavedItems(savedItems.filter((post) => post.id !== postId));
  };

  const filteredPosts =
    activeCollection === "All Saved"
      ? savedItems
      : savedItems.filter((post) => post.collection === activeCollection);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex gap-6 px-4 pt-6 pb-12 max-w-7xl mx-auto">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 max-w-4xl space-y-6">
          {/* Page Header */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Bookmark className="w-8 h-8 text-accent fill-accent" />
                Saved Posts
              </h1>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
            <p className="text-muted-foreground">
              {savedItems.length} articles saved for later reading
            </p>
          </div>

          {/* Collections Filter */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {collections.map((collection) => (
                <button
                  key={collection.name}
                  onClick={() => setActiveCollection(collection.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    activeCollection === collection.name
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-foreground hover:bg-accent/10"
                  }`}
                >
                  <collection.icon className="w-4 h-4" />
                  <span className="font-medium">{collection.name}</span>
                  <span className="text-xs opacity-75">
                    ({collection.count})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Saved Posts List */}
          {filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="flex gap-4 p-5">
                    {/* Post Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-48 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Post Content */}
                    <div className="flex-1 min-w-0">
                      {/* Author Info */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-semibold text-accent-foreground">
                          {post.avatar}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {post.author}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition cursor-pointer">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bookmark className="w-3 h-3" />
                            Saved {post.savedDate}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleUnsave(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <Bookmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">
                No saved posts in this collection
              </h3>
              <p className="text-muted-foreground mb-6">
                Start saving posts you want to read later
              </p>
              <Button className="bg-accent hover:bg-accent/90">
                Explore Posts
              </Button>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <aside className="hidden xl:block w-80 space-y-4">
          {/* Stats Card */}
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-accent" />
              Your Reading Stats
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Saved</p>
                <p className="text-2xl font-bold text-foreground">42</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Read This Month</p>
                <p className="text-2xl font-bold text-foreground">18</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reading Time</p>
                <p className="text-2xl font-bold text-foreground">12h 45m</p>
              </div>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20 rounded-lg p-6">
            <h3 className="font-bold text-foreground mb-3">💡 Pro Tip</h3>
            <p className="text-sm text-muted-foreground">
              Create collections to organize your saved posts by topics. This
              makes it easier to find what you're looking for later!
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
