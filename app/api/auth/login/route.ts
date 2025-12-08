import { NextRequest, NextResponse } from 'next/server'

// Mock user database (in production, this would be a real database)
const mockUsers = [
  {
    id: 'user-1',
    email: 'user@example.com',
    username: 'johndoe',
    display_name: 'John Doe',
    password_hash: 'SecurePass123!', // In production, this would be hashed
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe',
    bio: 'Full-stack developer passionate about web technologies',
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: { message: 'Email and password are required', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }

    // Find user (in production, query database)
    const user = mockUsers.find(u => u.email === email)

    if (!user || user.password_hash !== password) {
      return NextResponse.json(
        { error: { message: 'Invalid credentials', code: 'UNAUTHORIZED', status: 401 } },
        { status: 401 }
      )
    }

    // Generate mock JWT tokens (in production, use proper JWT library)
    const accessToken = `jwt_access_${user.id}_${Date.now()}`
    const refreshToken = `jwt_refresh_${user.id}_${Date.now()}`

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          display_name: user.display_name,
          avatar_url: user.avatar_url,
          role: 'user',
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: 'Bearer',
          expires_in: 86400,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}
