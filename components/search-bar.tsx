'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, User, FileText } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

interface Suggestion {
  id: string
  title?: string
  username?: string
  name?: string
  avatar?: string
  type: 'post' | 'user'
}

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  showSuggestions?: boolean
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search posts, users...',
  showSuggestions = true
}: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{ posts: Suggestion[]; users: Suggestion[] }>({
    posts: [],
    users: []
  })
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout>()

  // Fetch suggestions from API
  const fetchSuggestions = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions({ posts: [], users: [] })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(
        `http://localhost:3000/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=5`
      )
      const data = await response.json()

      if (data.success) {
        setSuggestions(data.data)
        setShowDropdown(true)
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Debounce search input
  useEffect(() => {
    if (!showSuggestions) return

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      if (query.trim()) {
        fetchSuggestions(query)
      } else {
        setSuggestions({ posts: [], users: [] })
        setShowDropdown(false)
      }
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [query, showSuggestions])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setShowDropdown(false)
      if (onSearch) {
        onSearch(query)
      } else {
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setShowDropdown(false)
    setQuery('')

    if (suggestion.type === 'post') {
      router.push(`/posts/${suggestion.id}`)
    } else {
      router.push(`/profile/${suggestion.username}`)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions({ posts: [], users: [] })
    setShowDropdown(false)
  }

  const hasSuggestions = suggestions.posts.length > 0 || suggestions.users.length > 0

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && hasSuggestions && setShowDropdown(true)}
          className="pl-10 pr-10 bg-secondary/50 border-none focus-visible:ring-1"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && showDropdown && hasSuggestions && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {isLoading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {!isLoading && (
            <>
              {/* Posts Section */}
              {suggestions.posts.length > 0 && (
                <div className="border-b border-border">
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    Posts
                  </div>
                  {suggestions.posts.map((post) => (
                    <button
                      key={post.id}
                      onClick={() => handleSuggestionClick(post)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary/50 transition text-left"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate">{post.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Users Section */}
              {suggestions.users.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    Users
                  </div>
                  {suggestions.users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSuggestionClick(user)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary/50 transition text-left"
                    >
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{user.name}</div>
                        <div className="text-xs text-muted-foreground truncate">@{user.username}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
