import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const postId = searchParams.get('post_id')

    if (!postId) {
      return NextResponse.json(
        { error: { message: 'post_id is required', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }

    const response = await fetch(`${API_URL}/posts/${postId}/comments?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Comments GET API error:', error)
    return NextResponse.json(
      { error: { message: 'Failed to fetch comments', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { post_id } = body
    const authHeader = request.headers.get('Authorization')

    if (!authHeader) {
      return NextResponse.json(
        { error: { message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 } },
        { status: 401 }
      )
    }

    if (!post_id) {
      return NextResponse.json(
        { error: { message: 'post_id is required', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }

    const response = await fetch(`${API_URL}/posts/${post_id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Comments POST API error:', error)
    return NextResponse.json(
      { error: { message: 'Failed to create comment', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}