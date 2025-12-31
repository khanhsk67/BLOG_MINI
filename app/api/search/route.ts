import { NextRequest, NextResponse } from "next/server";

// TODO: Replace with actual database queries
// This is a placeholder that you'll connect to your backend API or database

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "all"; // all, posts, users

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: true,
        results: {
          posts: [],
          users: [],
        },
      });
    }

    // TODO: Replace with actual API call to your backend
    // Example:
    // const response = await fetch(`${process.env.BACKEND_API_URL}/search?q=${query}&type=${type}`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //   },
    // });
    // const data = await response.json();

    // Placeholder response - replace with actual backend call
    const results = await performSearch(query, type);

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform search" },
      { status: 500 }
    );
  }
}

// TODO: Replace this with actual backend API call
async function performSearch(query: string, type: string) {
  // This is a placeholder function
  // In production, this should call your backend API
  
  const lowerQuery = query.toLowerCase();

  // Mock search results - replace with actual backend data
  const mockPosts = [
    {
      id: "1",
      author: { name: "John Doe", username: "johndoe", avatar: "/placeholder-user.jpg" },
      content: "This is a sample post about technology and innovation",
      timestamp: new Date().toISOString(),
      likes: 10,
      comments: 5,
    },
  ];

  const mockUsers = [
    {
      id: "1",
      name: "Jane Smith",
      username: "janesmith",
      avatar: "/placeholder-user.jpg",
      bio: "Software developer and tech enthusiast",
      followers: 100,
    },
  ];

  // Filter based on query
  const filteredPosts = mockPosts.filter(
    (post) =>
      post.content.toLowerCase().includes(lowerQuery) ||
      post.author.name.toLowerCase().includes(lowerQuery) ||
      post.author.username.toLowerCase().includes(lowerQuery)
  );

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(lowerQuery) ||
      user.username.toLowerCase().includes(lowerQuery) ||
      user.bio.toLowerCase().includes(lowerQuery)
  );

  if (type === "posts") {
    return { posts: filteredPosts, users: [] };
  } else if (type === "users") {
    return { posts: [], users: filteredUsers };
  }

  return {
    posts: filteredPosts,
    users: filteredUsers,
  };
}