"use client";

// Import các thư viện cần thiết
import { useState } from "react"; // Hook để quản lý state
import { useRouter } from "next/navigation"; // Hook để điều hướng trang
import Header from "@/components/header"; // Component Header
import Sidebar from "@/components/sidebar"; // Component Sidebar
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Eye,
  Shield,
  Trash2,
  LogOut,
} from "lucide-react"; // Import các icon từ thư viện lucide-react
import { Button } from "@/components/ui/button"; // Component Button
import { Input } from "@/components/ui/input"; // Component Input

// Định nghĩa kiểu dữ liệu cho các tab
type TabType = "profile" | "account" | "notifications" | "privacy" | "security";

// Interface cho mỗi item trong danh sách tabs
interface TabItem {
  id: TabType; // ID của tab
  label: string; // Tên hiển thị
  icon: any; // Icon của tab
}

export default function SettingsPage() {
  const router = useRouter(); // Khởi tạo router để điều hướng
  const [activeTab, setActiveTab] = useState<TabType>("profile"); // State quản lý tab đang active

  // State quản lý thông tin profile của user
  const [profile, setProfile] = useState({
    displayName: "John Doe", // Tên hiển thị
    username: "johndoe", // Tên người dùng
    email: "john@example.com", // Email
    bio: "Software developer and tech enthusiast", // Tiểu sử
    website: "https://johndoe.com", // Website cá nhân
    location: "San Francisco, CA", // Địa điểm
  });

  // State quản lý cài đặt thông báo
  const [notifications, setNotifications] = useState({
    emailNotifications: true, // Thông báo qua email
    pushNotifications: true, // Thông báo push
    weeklyDigest: false, // Tổng hợp hàng tuần
    newFollowers: true, // Thông báo người theo dõi mới
    comments: true, // Thông báo bình luận
    likes: false, // Thông báo lượt thích
  });

  // State quản lý cài đặt quyền riêng tư
  const [privacy, setPrivacy] = useState({
    profileVisibility: "public", // Chế độ hiển thị profile
    showEmail: false, // Hiển thị email
    showActivity: true, // Hiển thị hoạt động
  });

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xóa cookies xác thực
    document.cookie = "authToken=; path=/; max-age=0";
    document.cookie = "refreshToken=; path=/; max-age=0";
    // Chuyển hướng về trang login
    router.push("/login");
  };

  // Danh sách các tabs trong sidebar
  const tabs: TabItem[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "security", label: "Security", icon: Shield },
  ];

  // Hàm lấy mô tả cho từng loại thông báo
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
      {/* Header component */}
      <Header />

      {/* Container chính */}
      <main className="flex gap-6 px-4 pt-6 pb-12 max-w-7xl mx-auto">
        {/* Sidebar bên trái */}
        <Sidebar />

        {/* Nội dung chính */}
        <div className="flex-1 max-w-5xl">
          {/* Tiêu đề trang */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-accent" />
              Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Container cho sidebar tabs và content */}
          <div className="flex gap-6">
            {/* Sidebar tabs bên trái */}
            <div className="w-64 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)} // Đổi tab khi click
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      activeTab === tab.id
                        ? "bg-accent text-accent-foreground" // Style cho tab đang active
                        : "bg-card text-foreground hover:bg-secondary border border-border" // Style cho tab không active
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Vùng hiển thị nội dung của tab được chọn */}
            <div className="flex-1 bg-card border border-border rounded-lg p-6">
              {/* TAB PROFILE - Thông tin cá nhân */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Profile Information
                    </h2>

                    <div className="space-y-4">
                      {/* Input tên hiển thị */}
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

                      {/* Input username */}
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

                      {/* Textarea cho bio */}
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

                      {/* Input website */}
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

                      {/* Input địa điểm */}
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

                    {/* Nút lưu thay đổi */}
                    <Button className="mt-6 bg-accent hover:bg-accent/90">
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB ACCOUNT - Cài đặt tài khoản */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Account Settings
                    </h2>

                    <div className="space-y-4">
                      {/* Hiển thị email (disabled) */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <Input value={profile.email} disabled />
                        <p className="text-xs text-muted-foreground mt-1">
                          Contact support to change your email
                        </p>
                      </div>

                      {/* Section đổi mật khẩu */}
                      <div className="pt-4 border-t border-border">
                        <h3 className="font-semibold text-foreground mb-3">
                          Change Password
                        </h3>
                        <div className="space-y-3">
                          <Input
                            type="password"
                            placeholder="Current password"
                          />
                          <Input type="password" placeholder="New password" />
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                          />
                        </div>
                        <Button className="mt-4 bg-accent hover:bg-accent/90">
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB NOTIFICATIONS - Cài đặt thông báo */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {/* Lặp qua tất cả các cài đặt thông báo */}
                    {Object.entries(notifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 bg-secondary rounded-lg"
                      >
                        <div>
                          {/* Tên cài đặt (chuyển camelCase thành chuỗi có khoảng trắng) */}
                          <p className="font-medium text-foreground capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          {/* Mô tả cài đặt */}
                          <p className="text-sm text-muted-foreground">
                            {getNotificationLabel(key)}
                          </p>
                        </div>
                        {/* Toggle switch tùy chỉnh */}
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
                            className="sr-only peer" // Ẩn checkbox gốc
                          />
                          {/* Custom toggle UI */}
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Nút lưu cài đặt */}
                  <Button className="bg-accent hover:bg-accent/90">
                    Save Preferences
                  </Button>
                </div>
              )}

              {/* TAB PRIVACY - Cài đặt quyền riêng tư */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Privacy Settings
                  </h2>

                  <div className="space-y-4">
                    {/* Dropdown chọn chế độ hiển thị profile */}
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

                    {/* Toggle hiển thị email */}
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

                    {/* Toggle hiển thị hoạt động */}
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

                  {/* Nút lưu cài đặt quyền riêng tư */}
                  <Button className="bg-accent hover:bg-accent/90">
                    Save Privacy Settings
                  </Button>
                </div>
              )}

              {/* TAB SECURITY - Bảo mật */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Security
                  </h2>

                  <div className="space-y-4">
                    {/* Xác thực 2 yếu tố */}
                    <div className="p-4 bg-secondary rounded-lg">
                      <h3 className="font-semibold text-foreground mb-2">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>

                    {/* Phiên đăng nhập đang hoạt động */}
                    <div className="p-4 bg-secondary rounded-lg">
                      <h3 className="font-semibold text-foreground mb-2">
                        Active Sessions
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Manage devices where you're currently logged in
                      </p>
                      <Button variant="outline">View Sessions</Button>
                    </div>

                    {/* Lịch sử đăng nhập */}
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

                  {/* Danger Zone - Vùng nguy hiểm */}
                  <div className="pt-6 border-t border-border">
                    <h3 className="font-semibold text-destructive mb-4">
                      Danger Zone
                    </h3>

                    <div className="space-y-3">
                      {/* Nút xóa tài khoản */}
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

                      {/* Nút đăng xuất khỏi tất cả thiết bị */}
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
