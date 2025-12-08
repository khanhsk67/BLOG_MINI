import { NextRequest, NextResponse } from 'next/server'

// Mock user database
const mockUsers: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password, display_name } = body

    // Validation
    if (!email || !username || !password || !display_name) {
      return NextResponse.json(
        { error: { message: 'All fields are required', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: { message: 'Invalid email format', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }

    // Username validation (3-50 chars, alphanumeric + underscore)
    if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
      return NextResponse.json(
        { error: { message: 'Username must be 3-50 characters, alphanumeric and underscore only', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: { message: 'Password must be at least 8 characters', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { error: { message: 'Password must contain an uppercase letter', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }
    if (!/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: { message: 'Password must contain a number', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return NextResponse.json(
        { error: { message: 'Password must contain a special character', code: 'VALIDATION_ERROR', status: 422 } },
        { status: 422 }
      )
    }

    // Check if email exists (in production, query database)
    if (mockUsers.some(u => u.email === email)) {
      return NextResponse.json(
        { error: { message: 'Email already exists', code: 'VALIDATION_ERROR', status: 400 } },
        { status: 400 }
      )
    }

    // Check if username exists
    if (mockUsers.some(u => u.username === username)) {
      return NextResponse.json(
        { error: { message: 'Username already exists', code: 'VALIDATION_ERROR', status: 400 } },
        { status: 400 }
      )
    }

    // Create user (in production, hash password and save to database)
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      username,
      display_name,
      password_hash: password, // In production, use bcrypt
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      bio: '',
      email_verified: false,
      created_at: new Date().toISOString(),
    }

    mockUsers.push(newUser)

    // Generate mock JWT tokens
    const accessToken = `jwt_access_${newUser.id}_${Date.now()}`
    const refreshToken = `jwt_refresh_${newUser.id}_${Date.now()}`

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          display_name: newUser.display_name,
          avatar_url: newUser.avatar_url,
          email_verified: false,
          created_at: newUser.created_at,
        },
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
          token_type: 'Bearer',
          expires_in: 86400,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: { message: 'Internal server error', code: 'SERVER_ERROR', status: 500 } },
      { status: 500 }
    )
  }
}
