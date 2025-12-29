import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Mock user database
const mockUsers: any = {
  'user-1': {
    id: 'user-1',
    username: 'johndoe',
    display_name: 'John Doe',
    email: 'john@example.com',
    bio: 'Hello! I\'m a blogger passionate about technology and design.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe',
    created_at: new Date().toISOString(),
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies - MUST AWAIT
    const cookieStore = await cookies()
    const authToken = cookieStore.get('authToken')

    if (!authToken) {
      return NextResponse.json(
        { error: { message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 } },
        { status: 401 }
      )
    }

    // In production, decode token to get user_id
    // For now, return mock user
    const userId = 'user-1'
    const user = mockUsers[userId]

    if (!user) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'NOT_FOUND', status: 404 } },
        { status: 404 }
      )
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { error: { message: 'Failed to fetch profile', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Get auth token from cookies - MUST AWAIT
    const cookieStore = await cookies()
    const authToken = cookieStore.get('authToken')

    if (!authToken) {
      return NextResponse.json(
        { error: { message: 'Unauthorized', code: 'UNAUTHORIZED', status: 401 } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { display_name, bio, avatar_url } = body

    // In production, decode token to get user_id
    const userId = 'user-1'
    const user = mockUsers[userId]

    if (!user) {
      return NextResponse.json(
        { error: { message: 'User not found', code: 'NOT_FOUND', status: 404 } },
        { status: 404 }
      )
    }

    // Update user data
    if (display_name !== undefined) user.display_name = display_name
    if (bio !== undefined) user.bio = bio
    if (avatar_url !== undefined) user.avatar_url = avatar_url

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Profile PATCH error:', error)
    return NextResponse.json(
      { error: { message: 'Failed to update profile', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}