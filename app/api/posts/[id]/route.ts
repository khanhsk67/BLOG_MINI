import { NextRequest, NextResponse } from 'next/server'
import { mockPosts } from '@/lib/mock-posts'


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const post = mockPosts.find(p => p.id === id || p.slug === id)

    if (!post) {
      return NextResponse.json(
        { error: { message: 'Post not found', code: 'NOT_FOUND', status: 404 } },
        { status: 404 }
      )
    }

    return NextResponse.json(post, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Server error', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    const post = mockPosts.find(p => p.id === id)
    if (!post) {
      return NextResponse.json(
        { error: { message: 'Post not found', code: 'NOT_FOUND', status: 404 } },
        { status: 404 }
      )
    }

    Object.assign(post, body)

    return NextResponse.json(post, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to update post', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const index = mockPosts.findIndex(p => p.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: { message: 'Post not found', code: 'NOT_FOUND', status: 404 } },
        { status: 404 }
      )
    }

    mockPosts.splice(index, 1)

    return NextResponse.json(
      { message: 'Post deleted successfully', post_id: id },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to delete post', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}
