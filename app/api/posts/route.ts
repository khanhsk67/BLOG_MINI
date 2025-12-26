import { NextRequest, NextResponse } from 'next/server'
import { mockPosts } from '@/lib/mock-posts'



export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || 'published'

    // Pagination
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedPosts = mockPosts.slice(start, end)

    return NextResponse.json(
      {
        posts: paginatedPosts,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(mockPosts.length / limit),
          total_posts: mockPosts.length,
          per_page: limit,
          has_next: end < mockPosts.length,
          has_prev: page > 1,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to fetch posts', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, excerpt, featured_image_url, tags, status } = body

    // Authorization check (in production)
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: { message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 } },
        { status: 401 }
      )
    }

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { error: { message: 'Title and content are required', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }

    const newPost = {
      id: `post-${Date.now()}`,
      author_id: 'user-1', // In production, extract from token
      author: {
        id: 'user-1',
        username: 'johndoe',
        name: 'John Doe',
        display_name: 'John Doe',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe',
      },
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      content,
      excerpt: excerpt || content.substring(0, 300),
      featured_image_url,
      tags: tags || [],
      status: status || 'draft',
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    mockPosts.push(newPost)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to create post', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}
