'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CommentSection from '@/components/comment-section'

interface PostCardProps {
  post: {
    id: string
    author: {
      id: string
      name: string
      username: string
      avatar: string
      bio: string
    }
    title: string
    excerpt: string
    content: string
    image?: string
    tags: string[]
    createdAt: Date
    likes: number
    comments: number
    isLiked: boolean
    isSaved: boolean
  }
  onLike: (postId: string) => void
  onSave: (postId: string) => void
}

export default function PostCard({ post, onLike, onSave }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return 'now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <img
              src={post.author.avatar || '/placeholder.svg'}
              alt={post.author.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{post.author.name}</span>
                <span className="text-sm text-muted-foreground">@{post.author.username}</span>
              </div>
              <p className="text-xs text-muted-foreground">{timeAgo(post.createdAt)}</p>
            </div>
          </div>
          <button className="p-1 hover:bg-secondary rounded-full transition">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            <Link href={`/posts/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
          <p className="text-sm text-foreground line-clamp-2">
            <Link href={`/posts/${post.id}`} className="hover:underline">
              {post.excerpt}
            </Link>
          </p>
        </div>

        {post.image && (
          <Link
            href={`/posts/${post.id}`}
            className="block rounded-lg overflow-hidden bg-secondary aspect-video"
          >
            <img
              src={post.image || '/placeholder.svg'}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </Link>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-xs bg-secondary text-primary px-2 py-1 rounded-full hover:bg-muted transition cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-2 border-t border-b border-border text-xs text-muted-foreground flex gap-4">
        <span>{post.likes} likes</span>
        <span>{post.comments} comments</span>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike(post.id)}
          className={`flex-1 flex items-center gap-2 ${
            post.isLiked ? 'text-accent' : 'text-muted-foreground'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
          <span className="text-xs">Like</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center gap-2 text-muted-foreground"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-xs">Comment</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSave(post.id)}
          className={`flex-1 flex items-center gap-2 ${
            post.isSaved ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-current' : ''}`} />
          <span className="text-xs">Save</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1 flex items-center gap-2 text-muted-foreground"
        >
          <Share2 className="w-4 h-4" />
          <span className="text-xs">Share</span>
        </Button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="border-t border-border">
          <CommentSection postId={post.id} />
        </div>
      )}
    </div>
  )
}
