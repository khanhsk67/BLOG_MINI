import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward request to backend API
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    // Transform backend response format to match frontend expectations
    const transformedData = {
      user: data.data?.user || data.user,
      tokens: {
        access_token: data.data?.tokens?.accessToken || data.tokens?.accessToken,
        refresh_token: data.data?.tokens?.refreshToken || data.tokens?.refreshToken,
        token_type: 'Bearer',
        expires_in: 86400,
      }
    }

    return NextResponse.json(transformedData, { status: response.status })
  } catch (error) {
    console.error('Register API error:', error)
    return NextResponse.json(
      { error: { message: 'Failed to connect to backend API', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}
