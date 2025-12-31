import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const queryString = searchParams.toString()

    // Get auth header if available (optional for GET)
    const authHeader = request.headers.get('Authorization')

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    // Forward request to backend API
    const response = await fetch(`${API_URL}/posts${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Posts GET API error:', error)
    return NextResponse.json(
      { error: { message: 'Failed to fetch posts', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get('Authorization')

    if (!authHeader) {
      return NextResponse.json(
        { error: { message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 } },
        { status: 401 }
      )
    }

    // Forward request to backend API
    const response = await fetch(`${API_URL}/posts`, {
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
    console.error('Posts POST API error:', error)
    return NextResponse.json(
      { error: { message: 'Failed to create post', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}