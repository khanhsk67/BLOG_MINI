import { NextRequest, NextResponse } from 'next/server'
import { mockComments } from '@/lib/mock-comments'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: { message: 'content is required', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }

    const comment = mockComments.find(c => c.id === id)
    if (!comment) {
      return NextResponse.json(
        { error: { message: 'Comment not found', code: 'NOT_FOUND', status: 404 } },
        { status: 404 }
      )
    }

    comment.content = content
    comment.is_edited = true

    return NextResponse.json(comment, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to update comment', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const index = mockComments.findIndex(c => c.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: { message: 'Comment not found', code: 'NOT_FOUND', status: 404 } },
        { status: 404 }
      )
    }

    mockComments.splice(index, 1)

    return NextResponse.json({ message: 'Comment deleted', comment_id: id }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Failed to delete comment', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}