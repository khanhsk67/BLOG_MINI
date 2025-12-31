'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CommentSection from '@/components/comment-section'
import FollowButton from '@/components/follow-button'

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
    isFollowing?: boolean
  }
  onLike: (postId: string) => void
  onSave: (postId: string) => void
  currentUserId?: string
}

export default function PostCard({ post, onLike, onSave, currentUserId }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const [isFollowing, setIsFollowing] = useState(post.isFollowing || false)
  const [imageError, setImageError] = useState(false)

  // Don't show follow button if viewing own post
  const showFollowButton = currentUserId && currentUserId !== post.author.id

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
          <div className="flex gap-3 flex-1">
            <img
              src={post.author.avatar || '/default-avatar.jpg'}
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
          <div className="flex items-center gap-2">
            {showFollowButton && (
              <FollowButton
                userId={post.author.id}
                username={post.author.username}
                initialIsFollowing={isFollowing}
                onFollowChange={setIsFollowing}
                variant="default"
                size="sm"
              />
            )}
            <button className="p-1 hover:bg-secondary rounded-full transition">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Post Content */}
        <div className="px-4 pt-3">
          <p className="text-foreground whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Cover Image - Full Width */}
        {post.image && !imageError && (
          <Link href={`/posts/${post.id}`} className="block">
            <img
              src={post.image}
              alt="Post image"
              className="w-full object-cover max-h-96"
              onError={() => setImageError(true)}
            />
          </Link>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="px-4 pb-3 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-secondary text-primary px-2 py-1 rounded-full hover:bg-muted transition cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
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
          <CommentSection postId={post.id} postAuthorId={post.author.id} />
        </div>
      )}
    </div>
  )
}
