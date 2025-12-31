"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, LogOut, Calendar, MapPin, Link as LinkIcon, Loader2, FileText } from "lucide-react";
import Header from "@/components/header";
import PostCard from "@/components/post-card";

export default function ProfilePage() {
  const router = useRouter();

  // State cho thông tin user
  const [profile, setProfile] = useState({
    displayName: "",
    username: "",
    email: "",
    bio: "",
    avatar: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State cho posts
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [stats, setStats] = useState({
    postsCount: 0,
    followersCount: 0,
    followingCount: 0
  });

  // Load thông tin profile khi component mount
  useEffect(() => {
    loadProfile();
    loadPosts();
    loadStats();
  }, []);

  const loadProfile = async () => {
    try {
      // Call API to get user info
      const response = await fetch("http://localhost:3000/api/users/me/profile", {
        credentials: 'include', // ✅ Add this for cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load profile");

      const data = await response.json();
      const userData = data.data?.user || data.user || data.data || data;
      setProfile({
        displayName: userData.display_name || "",
        username: userData.username || "",
        email: userData.email || "",
        bio: userData.bio || "",
        avatar: userData.avatar_url || "",
      });
    } catch (err) {
      console.error("Error loading profile:", err);
      // If no API, use mock data
      setProfile({
        displayName: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        bio: "Hello! I'm a blogger.",
        avatar: "",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Call API to update profile
      const response = await fetch("http://localhost:3000/api/users/me/profile", {
        method: "PUT",
        credentials: 'include', // ✅ Add this for cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          display_name: profile.displayName,
          bio: profile.bio,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      // Hide notification after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };
  const loadPosts = async () => {
    setIsLoadingPosts(true);
    try {
      const response = await fetch("http://localhost:3000/api/users/me/posts", {
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Posts data from API:", data.data); // Debug log
        // Transform backend data to match PostCard format
        const transformedPosts = (data.data || []).map((post: any) => {
          const imageUrl = post.featured_image_url || post.cover_image_url || undefined;
          return {
            id: post.id,
            author: {
              id: post.author?.id || '',
              name: post.author?.display_name || post.author?.username || 'Unknown',
              username: post.author?.username || '',
              avatar: post.author?.avatar_url || '/default-avatar.jpg',
              bio: post.author?.bio || ''
            },
            title: post.title,
            excerpt: post.excerpt || '',
            content: post.content,
            image: imageUrl,
            tags: post.tags?.map((t: any) => t.name || t) || [],
            createdAt: new Date(post.created_at || post.published_at),
            likes: post.like_count || post._count?.likes || post.likes_count || 0,
            comments: post.comment_count || post._count?.comments || post.comments_count || 0,
            isLiked: post.is_liked || false,
            isSaved: post.is_saved || false,
            isFollowing: false // Own posts
          };
        });
        console.log("Transformed posts:", transformedPosts); // Debug log
        setPosts(transformedPosts);
      } else {
        console.error("Failed to load posts:", response.status, response.statusText);
      }
    } catch (err) {
      console.error("Error loading posts:", err);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/me/stats", {
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats({
          postsCount: data.data?.postsCount || 0,
          followersCount: data.data?.followersCount || 0,
          followingCount: data.data?.followingCount || 0
        });
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  const handleLike = async (postId: string) => {
    // Toggle like status
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));

    // Call API to like/unlike
    try {
      const method = posts.find(p => p.id === postId)?.isLiked ? 'DELETE' : 'POST';
      await fetch(`http://localhost:3000/api/posts/${postId}/like`, {
        method,
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleSavePost = async (postId: string) => {
    // Toggle save status
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));

    // Call API to save/unsave
    try {
      const method = posts.find(p => p.id === postId)?.isSaved ? 'DELETE' : 'POST';
      await fetch(`http://localhost:3000/api/posts/${postId}/save`, {
        method,
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  const handleLogout = () => {
    // Xóa cookie
    document.cookie = "authToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";

    // Redirect về login
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Cover Image */}
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
          <div className="relative">
            <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 h-48 md:h-64"></div>

            {/* Avatar */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={profile.avatar || "/default-avatar.jpg"}
                  alt={profile.displayName}
                  className="w-32 h-32 rounded-full border-4 border-card object-cover shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground">
                  {profile.displayName}
                </h1>
                <p className="text-muted-foreground mt-1">@{profile.username}</p>

                {profile.bio && (
                  <p className="text-foreground mt-4 max-w-2xl">
                    {profile.bio}
                  </p>
                )}

                <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined 2024</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-accent hover:bg-accent/90 gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        loadProfile();
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.postsCount}</p>
                <p className="text-sm text-muted-foreground">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.followersCount}</p>
                <p className="text-sm text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{stats.followingCount}</p>
                <p className="text-sm text-muted-foreground">Following</p>
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-sm text-green-700">
                {success}
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0">
              <TabsTrigger
                value="posts"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                <FileText className="w-4 h-4 mr-2" />
                Posts ({stats.postsCount})
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                <Settings className="w-4 h-4 mr-2" />
                About & Settings
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="mt-6">
              {isLoadingPosts ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onLike={handleLike}
                      onSave={handleSavePost}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-card border border-border rounded-lg p-12 text-center">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-4">You haven't created any posts yet.</p>
                  <Button onClick={() => router.push('/create-post')}>
                    Create Your First Post
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <div className="bg-card border border-border rounded-lg p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Profile Settings</h2>

                <div className="space-y-6">
                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Display Name
                    </label>
                    {isEditing ? (
                      <Input
                        type="text"
                        name="displayName"
                        value={profile.displayName}
                        onChange={handleChange}
                        className="max-w-md"
                      />
                    ) : (
                      <p className="text-lg text-foreground">
                        {profile.displayName}
                      </p>
                    )}
                  </div>

                  {/* Username (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Username
                    </label>
                    <p className="text-lg text-muted-foreground">
                      @{profile.username}
                    </p>
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <p className="text-lg text-muted-foreground">{profile.email}</p>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        rows={4}
                        className="w-full max-w-2xl px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-foreground whitespace-pre-wrap">
                        {profile.bio || "No bio yet."}
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border my-8"></div>

                  {/* Danger Zone */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      Account Actions
                    </h3>
                    <div className="space-y-3">
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="gap-2 text-destructive border-destructive hover:bg-destructive hover:text-white"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
