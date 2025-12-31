'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface FollowButtonProps {
  userId: string
  username?: string
  initialIsFollowing?: boolean
  onFollowChange?: (isFollowing: boolean) => void
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

export default function FollowButton({
  userId,
  username,
  initialIsFollowing = false,
  onFollowChange,
  variant = 'default',
  size = 'default'
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsFollowing(initialIsFollowing)
  }, [initialIsFollowing])

  const handleFollow = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    setIsLoading(true)

    try {
      const endpoint = `http://localhost:3000/api/users/${userId}/follow`
      const method = isFollowing ? 'DELETE' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const newFollowState = !isFollowing
        setIsFollowing(newFollowState)
        onFollowChange?.(newFollowState)
      } else {
        const error = await response.json()
        console.error('Follow/unfollow error:', error)
        alert(error.message || 'Failed to update follow status')
      }
    } catch (error) {
      console.error('Follow/unfollow error:', error)
      alert('Failed to update follow status')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={isLoading}
      variant={isFollowing ? 'outline' : variant}
      size={size}
      className={isFollowing ? 'hover:bg-destructive hover:text-destructive-foreground' : ''}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </span>
      ) : (
        isFollowing ? 'Unfollow' : 'Follow'
      )}
    </Button>
  )
}
