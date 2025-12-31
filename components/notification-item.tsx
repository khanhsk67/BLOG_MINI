"use client";

import { Heart, MessageCircle, UserPlus, AtSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NotificationItemProps {
  notification: {
    id: string;
    type: "like" | "comment" | "follow" | "mention";
    user: {
      name: string;
      username: string;
      avatar: string;
    };
    content: string;
    postId?: string;
    timestamp: string;
    read: boolean;
  };
  onMarkAsRead: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500 fill-red-500" />;
      case "comment":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case "mention":
        return <AtSign className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getActionText = () => {
    switch (notification.type) {
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      case "follow":
        return "started following you";
      case "mention":
        return "mentioned you in a post";
      default:
        return "";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
  };

  const href = notification.postId
    ? `/posts/${notification.postId}`
    : `/profile?username=${notification.user.username}`;

  return (
    <Link href={href} onClick={handleClick}>
      <div
        className={cn(
          "flex gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
          !notification.read && "bg-blue-50 dark:bg-blue-950/20"
        )}
      >
        <Avatar className="h-10 w-10">
          <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
          <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <div className="mt-1">{getIcon()}</div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{notification.user.name}</span>{" "}
                <span className="text-muted-foreground">{getActionText()}</span>
              </p>
              {notification.content && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {notification.content}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formatTimestamp(notification.timestamp)}
              </p>
            </div>
          </div>
        </div>

        {!notification.read && (
          <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
        )}
      </div>
    </Link>
  );
}