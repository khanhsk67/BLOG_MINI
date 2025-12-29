import { NextRequest, NextResponse } from 'next/server'

// Mock comments database
const mockComments: any[] = []

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const postId = searchParams.get('post_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!postId) {
      return NextResponse.json(
        { error: { message: 'post_id is required', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }

    const postComments = mockComments.filter(c => c.post_id === postId)
    const start = (page - 1) * limit
    const paginatedComments = postComments.slice(start, start + limit)

    return NextResponse.json(
      {
        comments: paginatedComments,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(postComments.length / limit),
          total_comments: postComments.length,
          per_page: limit,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to fetch comments', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { post_id, content, parent_comment_id } = body

    if (!post_id || !content) {
      return NextResponse.json(
        { error: { message: 'post_id and content are required', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }

    const newComment = {
      id: `comment-${Date.now()}`,
      post_id,
      user_id: 'user-1',
      user: {
        id: 'user-1',
        username: 'johndoe',
        display_name: 'John Doe',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe',
      },
      content,
      parent_comment_id: parent_comment_id || null,
      reply_count: 0,
      is_edited: false,
      created_at: new Date().toISOString(),
    }

    mockComments.push(newComment)

    return NextResponse.json(newComment, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to create comment', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}