"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Eye,
  Shield,
  Trash2,
  LogOut,
  Upload,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TabType = "profile" | "account" | "notifications" | "privacy" | "security";

interface TabItem {
  id: TabType;
  label: string;
  icon: any;
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("/default-avatar.jpg");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Profile settings
  const [profile, setProfile] = useState({
    id: "",
    displayName: "",
    username: "",
    email: "",
    bio: "",
    avatarUrl: "/default-avatar.jpg",
    website: "",
    location: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch current user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("authToken="))
          ?.split("=")[1];

        if (!authToken) {
          router.push("/login"); // Redirect if not logged in
          return;
        }

        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Assuming structure: { success: true, data: { user: { ... } } }
          if (data.success && data.data?.user) {
            const user = data.data.user;
            setProfile({
              id: user.id || "",
              displayName: user.display_name || user.username || "",
              username: user.username || "",
              email: user.email || "",
              bio: user.bio || "",
              avatarUrl: user.avatar_url || "/default-avatar.jpg",
              website: "", // Backend might not support these yet
              location: "",
            });
            setAvatarUrl(user.avatar_url || "/default-avatar.jpg");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    newFollowers: true,
    comments: true,
    likes: false,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showEmail: false,
    showActivity: true,
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const authToken = document.cookie.split("; ").find((row) => row.startsWith("authToken="))?.split("=")[1];

      if (!authToken) {
        alert("Please login to upload avatar");
        return;
      }

      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/upload/avatar", {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload avatar");

      const data = await response.json();
      if (data.success && (data.data?.url || data.data?.avatar_url)) {
        const newUrl = data.data.url || data.data.avatar_url;
        setAvatarUrl(newUrl);
        // Also update profile state locally
        setProfile(prev => ({ ...prev, avatarUrl: newUrl }));
        alert("Avatar updated successfully!");
      } else {
        // Fallback if structure is different as seen in other snippets
        if (data.avatar_url || data.url) {
          setAvatarUrl(data.avatar_url || data.url);
          setProfile(prev => ({ ...prev, avatarUrl: data.avatar_url || data.url }));
          alert("Avatar updated successfully!");
        }
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      alert("Failed to upload avatar.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const authToken = document.cookie.split("; ").find((row) => row.startsWith("authToken="))?.split("=")[1];
      if (!authToken) return;

      // Use the existing /api/user/profile route which proxies to backend
      const response = await fetch(`/api/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          display_name: profile.displayName,
          bio: profile.bio,
        }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        const data = await response.json();
        console.error("Failed to update profile", data);
        alert(data.error?.message || "Failed to update profile");
      }
    } catch (e) {
      console.error("Error updating profile", e);
      alert("Error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match");
      return;
    }
    if (!passwords.current || !passwords.new) {
      alert("Please fill in all password fields");
      return;
    }

    try {
      const authToken = document.cookie.split("; ").find((row) => row.startsWith("authToken="))?.split("=")[1];
      if (!authToken) return;

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword: passwords.new
        }),
      });

      if (response.ok) {
        alert("Password changed successfully");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        const data = await response.json();
        alert(data.message || "Failed to change password");
      }
    } catch (e) {
      console.error("Error changing password", e);
      alert("Error changing password");
    }
  };

  const handleLogout = () => {
    document.cookie = "authToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
    router.push("/login");
  };

  const tabs: TabItem[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "security", label: "Security", icon: Shield },
  ];

  const getNotificationLabel = (key: string): string => {
    const labels: Record<string, string> = {
      emailNotifications: "Receive notifications via email",
      pushNotifications: "Get push notifications in browser",
      weeklyDigest: "Weekly summary of activity",
      newFollowers: "When someone follows you",
      comments: "When someone comments on your post",
      likes: "When someone likes your post",
    };
    return labels[key] || "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="flex gap-6 px-4 pt-6 pb-12 max-w-7xl mx-auto">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 max-w-5xl">
          {/* Page Header */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-accent" />
              Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="flex gap-6">
            {/* Sidebar Tabs */}
            <div className="w-64 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeTab === tab.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-card text-foreground hover:bg-secondary border border-border"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-card border border-border rounded-lg p-6">
              {/* PROFILE TAB */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Profile Information
                    </h2>

                    {/* Avatar Upload Section */}
                    <div className="mb-6 p-4 bg-secondary rounded-lg">
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Profile Picture
                      </label>
                      <div className="flex items-center gap-4">
                        {/* Avatar Preview */}
                        <div className="relative">
                          <img
                            src={avatarUrl}
                            alt="Avatar"
                            className="w-24 h-24 rounded-full object-cover border-2 border-border"
                          />
                          {isUploadingAvatar && (
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                          )}
                        </div>

                        {/* Upload Button */}
                        <div className="flex-1">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingAvatar}
                            variant="outline"
                            className="gap-2"
                          >
                            {isUploadingAvatar ? (
                              <>
                                <Upload className="w-4 h-4 animate-pulse" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Camera className="w-4 h-4" />
                                Upload New Avatar
                              </>
                            )}
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            JPG, PNG or GIF. Max size 5MB.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Display Name
                        </label>
                        <Input
                          value={profile.displayName}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              displayName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Username
                        </label>
                        <Input
                          value={profile.username}
                          onChange={(e) =>
                            setProfile({ ...profile, username: e.target.value })
                          }
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Your profile URL: miniblog.com/@{profile.username}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Bio
                        </label>
                        <textarea
                          value={profile.bio}
                          onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                          }
                          rows={3}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Website
                        </label>
                        <Input
                          value={profile.website}
                          onChange={(e) =>
                            setProfile({ ...profile, website: e.target.value })
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Location
                        </label>
                        <Input
                          value={profile.location}
                          onChange={(e) =>
                            setProfile({ ...profile, location: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <Button
                      className="mt-6 bg-accent hover:bg-accent/90"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              )}

              {/* ACCOUNT TAB */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Account Settings
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <Input value={profile.email} disabled />
                        <p className="text-xs text-muted-foreground mt-1">
                          Contact support to change your email
                        </p>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <h3 className="font-semibold text-foreground mb-3">
                          Change Password
                        </h3>
                        <div className="space-y-3">
                          <Input
                            type="password"
                            placeholder="Current password"
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                          />
                          <Input
                            type="password"
                            placeholder="New password"
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                          />
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                          />
                        </div>
                        <Button
                          className="mt-4 bg-accent hover:bg-accent/90"
                          onClick={handleChangePassword}
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {getNotificationLabel(key)}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                [key]: e.target.checked,
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <Button className="bg-accent hover:bg-accent/90">
                    Save Preferences
                  </Button>
                </div>
              )}

              {/* PRIVACY TAB */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Privacy Settings
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-secondary rounded-lg">
                      <label className="block font-medium text-foreground mb-2">
                        Profile Visibility
                      </label>
                      <select
                        value={privacy.profileVisibility}
                        onChange={(e) =>
                          setPrivacy({
                            ...privacy,
                            profileVisibility: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      >
                        <option value="public">Public</option>
                        <option value="followers">Followers Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">
                          Show Email
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Display your email on your profile
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.showEmail}
                          onChange={(e) =>
                            setPrivacy({
                              ...privacy,
                              showEmail: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">
                          Show Activity
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Let others see your reading activity
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy.showActivity}
                          onChange={(e) =>
                            setPrivacy({
                              ...privacy,
                              showActivity: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                      </label>
                    </div>
                  </div>

                  <Button className="bg-accent hover:bg-accent/90">
                    Save Privacy Settings
                  </Button>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Security
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-secondary rounded-lg">
                      <h3 className="font-semibold text-foreground mb-2">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg">
                      <h3 className="font-semibold text-foreground mb-2">
                        Active Sessions
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Manage devices where you're currently logged in
                      </p>
                      <Button variant="outline">View Sessions</Button>
                    </div>

                    <div className="p-4 bg-secondary rounded-lg">
                      <h3 className="font-semibold text-foreground mb-2">
                        Login History
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Review recent login activity
                      </p>
                      <Button variant="outline">View History</Button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border">
                    <h3 className="font-semibold text-destructive mb-4">
                      Danger Zone
                    </h3>

                    <div className="space-y-3">
                      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">
                              Delete Account
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Permanently delete your account and all data
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-secondary rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">
                              Sign Out Everywhere
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Sign out from all devices
                            </p>
                          </div>
                          <Button onClick={handleLogout} variant="outline">
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
