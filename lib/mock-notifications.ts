export const mockNotifications = [
  {
    id: "1",
    type: "like" as const,
    user: {
      name: "Sarah Johnson",
      username: "sarahj",
      avatar: "/placeholder-user.jpg",
    },
    content: "Your post about web development trends",
    postId: "post1",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    read: false,
  },
  {
    id: "2",
    type: "comment" as const,
    user: {
      name: "Mike Chen",
      username: "mikechen",
      avatar: "/placeholder-user.jpg",
    },
    content: "Great insights! I totally agree with your perspective on this.",
    postId: "post2",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    read: false,
  },
  {
    id: "3",
    type: "follow" as const,
    user: {
      name: "Emma Wilson",
      username: "emmaw",
      avatar: "/placeholder-user.jpg",
    },
    content: "",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: "4",
    type: "mention" as const,
    user: {
      name: "Alex Rodriguez",
      username: "alexr",
      avatar: "/placeholder-user.jpg",
    },
    content: "Check out this amazing article I found! @you might find it interesting.",
    postId: "post3",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    read: true,
  },
  {
    id: "5",
    type: "like" as const,
    user: {
      name: "David Lee",
      username: "davidlee",
      avatar: "/placeholder-user.jpg",
    },
    content: "Your comment on design principles",
    postId: "post4",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
  },
  {
    id: "6",
    type: "comment" as const,
    user: {
      name: "Lisa Park",
      username: "lisap",
      avatar: "/placeholder-user.jpg",
    },
    content: "This is exactly what I was looking for. Thanks for sharing!",
    postId: "post5",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: true,
  },
  {
    id: "7",
    type: "follow" as const,
    user: {
      name: "James Taylor",
      username: "jamest",
      avatar: "/placeholder-user.jpg",
    },
    content: "",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    read: true,
  },
  {
    id: "8",
    type: "like" as const,
    user: {
      name: "Rachel Green",
      username: "rachelg",
      avatar: "/placeholder-user.jpg",
    },
    content: "Your post about productivity tips",
    postId: "post6",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    read: true,
  },
];