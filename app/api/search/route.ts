import { NextRequest, NextResponse } from "next/server";

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

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000/api";

    // Initialize results
    let posts: any[] = [];
    let users: any[] = [];
    let error = null;

    // Parallel requests if type is 'all', otherwise single request
    const promises = [];

    if (type === "posts" || type === "all") {
      promises.push(
        fetch(`${backendUrl}/posts/search?query=${encodeURIComponent(query)}`)
          .then(async (res) => {
            if (!res.ok) return { posts: [] };
            const data = await res.json();
            return { posts: data.success ? data.data.posts : [] };
          })
          .catch((err) => {
            console.error("Error fetching posts:", err);
            return { posts: [] };
          })
      );
    }

    if (type === "users" || type === "all") {
      promises.push(
        fetch(`${backendUrl}/users/search?q=${encodeURIComponent(query)}`)
          .then(async (res) => {
            if (!res.ok) return { users: [] };
            const data = await res.json();
            // The API check for users might return 'data.users' or just 'data' depending on endpoint structure
            // Based on docs: GET /api/users/search?q=...
            // Let's assume standard response format: data: { users: [] } or just array in data?
            // Users/Search usually returns data.users if paginated, or array. 
            // Docs say for followers: data.followers. 
            // Let's assume data.users based on typical list response in this project.
            return { users: data.success && data.data ? (data.data.users || data.data) : [] };
          })
          .catch((err) => {
            console.error("Error fetching users:", err);
            return { users: [] };
          })
      );
    }

    const resultsArr = await Promise.all(promises);

    // Merge results
    resultsArr.forEach((result) => {
      if (result.posts) posts = result.posts;
      if (result.users) users = result.users;
    });

    return NextResponse.json({
      success: true,
      results: {
        posts,
        users,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform search" },
      { status: 500 }
    );
  }
}