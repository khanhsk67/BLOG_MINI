"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";

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

  // Load thông tin profile khi component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // Call API to get user info
      const response = await fetch("/api/user/profile", {
        credentials: 'include', // ✅ Add this for cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to load profile");

      const data = await response.json();
      setProfile({
        displayName: data.display_name || "",
        username: data.username || "",
        email: data.email || "",
        bio: data.bio || "",
        avatar: data.avatar_url || "",
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
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-accent/20 to-primary/20 h-32"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="flex justify-between items-start -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-accent border-4 border-card flex items-center justify-center text-4xl font-bold text-accent-foreground">
                  {profile.displayName.charAt(0).toUpperCase() || "U"}
                </div>
              </div>

              <div className="mt-20 space-x-3">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-accent hover:bg-accent/90"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditing(false);
                        loadProfile(); // Reset về dữ liệu cũ
                      }}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-sm text-green-700">
                {success}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Profile Form */}
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
                    className="w-full max-w-xs text-destructive border-destructive hover:bg-destructive hover:text-white"
                  >
                    Log Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-6 text-center">
            <p className="text-3xl font-bold text-foreground">12</p>
            <p className="text-sm text-muted-foreground mt-1">Posts</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6 text-center">
            <p className="text-3xl font-bold text-foreground">248</p>
            <p className="text-sm text-muted-foreground mt-1">Followers</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-6 text-center">
            <p className="text-3xl font-bold text-foreground">180</p>
            <p className="text-sm text-muted-foreground mt-1">Following</p>
          </div>
        </div>
      </main>
    </div>
  );
}
