'use client'

import { useState, useEffect } from 'react'
import CreatePost from '@/components/create-post'
import PostCard from '@/components/post-card'

const mockPostsOld = [
  {
    id: '1',
    author: {
      id: 'user-1',
      name: 'Sarah Chen',
      username: 'sarahchen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'Product Designer & Coffee Enthusiast'
    },
    title: 'The Future of Design Systems in 2025',
    excerpt: 'Exploring how AI and automation are reshaping the way we build design systems. From component generation to automated testing...',
    content: 'The landscape of design systems is rapidly evolving. Companies are now leveraging AI to generate components, automate testing, and even predict design patterns. This shift is not just about efficiency—it\'s fundamentally changing how designers and developers collaborate.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    tags: ['design', 'technology', 'ai'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 342,
    comments: 28,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    author: {
      id: 'user-2',
      name: 'Marcus Johnson',
      username: 'marcusj',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      bio: 'Full Stack Developer | Open Source Contributor'
    },
    title: 'Building Scalable React Applications',
    excerpt: 'Best practices and patterns I\'ve learned building applications at scale. Including state management, code splitting, and performance optimization...',
    content: 'After working on projects that handle millions of users, I\'ve identified key patterns that make React applications scalable. Let me share what I\'ve learned about managing complexity.',
    image: 'https://images.unsplash.com/photo-1633356713697-d5daa3b83203?w=600&h=400&fit=crop',
    tags: ['react', 'web-development', 'performance'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    likes: 215,
    comments: 42,
    isLiked: true,
    isSaved: false,
  },
  {
    id: '3',
    author: {
      id: 'user-3',
      name: 'Elena Rodriguez',
      username: 'elenrod',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      bio: 'UX Researcher | Accessibility Advocate'
    },
    title: 'Why Accessibility Isn\'t Optional',
    excerpt: 'A compelling case for making accessibility a core principle, not an afterthought. Real stories from users with disabilities...',
    content: 'Accessibility isn\'t just about compliance—it\'s about inclusion. When we design for people with disabilities, we create better products for everyone. Let me share some insights from recent research.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    tags: ['accessibility', 'ux', 'design'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    likes: 567,
    comments: 89,
    isLiked: false,
    isSaved: true,
  },
]

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [feedFilter, setFeedFilter] = useState<'all' | 'following'>('all')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const loadPosts = async () => {
    try {
      setIsLoading(true)

      // Get auth token if available
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1]

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const followingParam = feedFilter === 'following' ? '&following=true' : ''
      const response = await fetch(`/api/posts?status=published&limit=20${followingParam}`, {
        headers
      })

      if (!response.ok) {
        throw new Error('Failed to load posts')
      }

      const data = await response.json()

      // Transform backend data to match frontend format
      const transformedPosts = (data.posts || []).map((post: any) => {
        // Get image URL and proxy it through Next.js to avoid CORS
        let imageUrl = post.cover_image_url || post.featured_image_url || null

        // If image URL exists and points to localhost:3000, proxy it
        if (imageUrl && imageUrl.includes('localhost:3000')) {
          imageUrl = `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
        }

        console.log(`📸 Post ${post.id}:`, {
          cover_image_url: post.cover_image_url,
          featured_image_url: post.featured_image_url,
          finalImageUrl: imageUrl,
          content: post.content?.substring(0, 30)
        })

        return {
          id: post.id,
          author: {
            id: post.author_id || post.user?.id,
            name: post.author?.display_name || post.user?.display_name || 'Unknown',
            username: post.author?.username || post.user?.username || 'unknown',
            avatar: post.author?.avatar_url || post.user?.avatar_url || '/default-avatar.jpg',
            bio: post.author?.bio || post.user?.bio || ''
          },
          title: post.title,
          excerpt: post.excerpt || post.content?.substring(0, 150) + '...',
          content: post.content,
          image: imageUrl,
          tags: post.tags || [],
          createdAt: new Date(post.created_at),
          likes: post.like_count || 0,
          comments: post.comment_count || 0,
          isLiked: post.is_liked || false,
          isSaved: post.is_saved || false,
        }
      })

      setPosts(transformedPosts)
    } catch (err) {
      console.error('Error loading posts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [feedFilter])

  useEffect(() => {
    // Get current user ID from localStorage or auth
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setCurrentUserId(payload.id || null)
      } catch (err) {
        console.error('Error parsing token:', err)
      }
    }
  }, [])

  const handleLike = async (postId: string) => {
    try {
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1]

      if (!authToken) {
        alert('Please login to like posts')
        return
      }

      const post = posts.find(p => p.id === postId)
      if (!post) return

      const isCurrentlyLiked = post.isLiked
      const currentLikes = post.likes

      // Optimistic update
      setPosts(prevPosts => prevPosts.map(p =>
        p.id === postId
          ? { ...p, isLiked: !isCurrentlyLiked, likes: isCurrentlyLiked ? currentLikes - 1 : currentLikes + 1 }
          : p
      ))

      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isCurrentlyLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        // Revert on error using saved state
        setPosts(prevPosts => prevPosts.map(p =>
          p.id === postId
            ? { ...p, isLiked: isCurrentlyLiked, likes: currentLikes }
            : p
        ))
        const data = await response.json()
        console.error('Like error:', data)
      } else {
        // Update with actual like count from server
        const data = await response.json()
        if (data.like_count !== undefined) {
          setPosts(prevPosts => prevPosts.map(p =>
            p.id === postId
              ? { ...p, likes: data.like_count }
              : p
          ))
        }
      }
    } catch (err) {
      console.error('Error liking post:', err)
      // Reload posts on error to get correct state
      loadPosts()
    }
  }

  const handleSave = async (postId: string) => {
    try {
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1]

      if (!authToken) {
        alert('Please login to save posts')
        return
      }

      const post = posts.find(p => p.id === postId)
      if (!post) return

      const isCurrentlySaved = post.isSaved

      // Optimistic update
      setPosts(prevPosts => prevPosts.map(p =>
        p.id === postId ? { ...p, isSaved: !isCurrentlySaved } : p
      ))

      const response = await fetch(`/api/posts/${postId}/save`, {
        method: isCurrentlySaved ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        // Revert on error using saved state
        setPosts(prevPosts => prevPosts.map(p =>
          p.id === postId ? { ...p, isSaved: isCurrentlySaved } : p
        ))
        const data = await response.json()
        console.error('Save error:', data)
      }
    } catch (err) {
      console.error('Error saving post:', err)
      // Reload posts on error to get correct state
      loadPosts()
    }
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl space-y-6">
        <CreatePost onPostCreated={loadPosts} />
        <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <CreatePost onPostCreated={loadPosts} />

      {/* Feed Filter Tabs */}
      {currentUserId && (
        <div className="bg-card border border-border rounded-lg p-2 flex gap-2">
          <button
            onClick={() => setFeedFilter('all')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              feedFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => setFeedFilter('following')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              feedFilter === 'following'
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            Following
          </button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground">
            {feedFilter === 'following'
              ? 'No posts from people you follow. Start following users to see their posts here!'
              : 'No posts yet. Be the first to share something!'}
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onSave={handleSave}
            currentUserId={currentUserId || undefined}
          />
        ))
      )}
    </div>
  )
}
