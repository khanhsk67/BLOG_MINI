import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const authHeader = request.headers.get('Authorization')

    if (!authHeader) {
      return NextResponse.json(
        { error: { message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 } },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_URL}/comments/${id}`, {
      method: 'PUT',
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
    console.error('Comment PUT API error:', error)
    return NextResponse.json(
      { error: { message: 'Failed to update comment', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const authHeader = request.headers.get('Authorization')

    if (!authHeader) {
      return NextResponse.json(
        { error: { message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 } },
        { status: 401 }
      )
    }

    const response = await fetch(`${API_URL}/comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Comment DELETE API error:', error)
    return NextResponse.json(
      { error: { message: 'Failed to delete comment', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}