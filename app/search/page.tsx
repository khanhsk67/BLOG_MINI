'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchBar from '@/components/search-bar'
import PostCard from '@/components/post-card'
import { User, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  cover_image_url?: string
  created_at: string
  author: {
    id: string
    username: string
    name: string
    avatar?: string
  }
  _count?: {
    likes: number
    comments: number
  }
}

interface UserResult {
  id: string
  username: string
  name: string
  email: string
  avatar?: string
  bio?: string
}

type SearchType = 'all' | 'posts' | 'users'

function SearchContent() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('q')

  const [searchType, setSearchType] = useState<SearchType>('all')
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<UserResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuery, setCurrentQuery] = useState(queryParam || '')

  // Fetch search results
  const performSearch = async (query: string, type: SearchType = 'all') => {
    if (query.trim().length < 2) return

    setIsLoading(true)
    try {
      let endpoint = ''

      if (type === 'posts') {
        endpoint = `http://localhost:3000/api/search/posts?q=${encodeURIComponent(query)}&limit=20`
      } else if (type === 'users') {
        endpoint = `http://localhost:3000/api/search/users?q=${encodeURIComponent(query)}&limit=20`
      } else {
        endpoint = `http://localhost:3000/api/search?q=${encodeURIComponent(query)}&limit=20`
      }

      const response = await fetch(endpoint)
      const data = await response.json()

      if (data.success) {
        if (type === 'all') {
          setPosts(data.data.posts || [])
          setUsers(data.data.users || [])
        } else if (type === 'posts') {
          setPosts(data.data.posts || [])
          setUsers([])
        } else {
          setUsers(data.data.users || [])
          setPosts([])
        }
      }
    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Search when query param changes
  useEffect(() => {
    if (queryParam && queryParam.trim()) {
      setCurrentQuery(queryParam)
      performSearch(queryParam, searchType)
    }
  }, [queryParam])

  // Handle search type change
  const handleTypeChange = (type: SearchType) => {
    setSearchType(type)
    if (currentQuery) {
      performSearch(currentQuery, type)
    }
  }

  // Handle new search
  const handleSearch = (query: string) => {
    setCurrentQuery(query)
    performSearch(query, searchType)
  }

  const hasResults = posts.length > 0 || users.length > 0
  const showNoResults = !isLoading && currentQuery && !hasResults

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} showSuggestions={false} />
        </div>

        {/* Search Type Tabs */}
        {currentQuery && (
          <div className="flex gap-2 mb-6 border-b border-border">
            <button
              onClick={() => handleTypeChange('all')}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                searchType === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleTypeChange('posts')}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                searchType === 'posts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => handleTypeChange('users')}
              className={`px-4 py-2 font-medium transition border-b-2 ${
                searchType === 'users'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Users
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* No Results */}
        {showNoResults && (
          <div className="text-center py-12">
            <div className="mb-4 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p>Try searching with different keywords</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && hasResults && (
          <div className="space-y-8">
            {/* Posts Results */}
            {posts.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Posts ({posts.length})
                </h2>
                <div className="space-y-4">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* Users Results */}
            {users.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Users ({users.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.map((user) => (
                    <Link
                      key={user.id}
                      href={`/profile/${user.username}`}
                      className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:bg-secondary/50 transition"
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{user.name}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          @{user.username}
                        </div>
                        {user.bio && (
                          <div className="text-sm text-muted-foreground truncate mt-1">
                            {user.bio}
                          </div>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!currentQuery && (
          <div className="text-center py-12">
            <div className="mb-4 text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Search MiniBlog</h3>
              <p>Find posts and users by typing in the search bar above</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
