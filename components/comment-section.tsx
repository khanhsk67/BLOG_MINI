'use client'

import { useEffect, useState } from 'react'
import { Trash2, Edit2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Comment {
  id: string
  userId: string // ID của người tạo comment
  author: {
    name: string
    username: string
    avatar: string
  }
  content: string
  createdAt: Date
  replies?: Comment[]
  is_edited?: boolean
}

// Simple current user mock (replace with auth in production)
const CURRENT_USER = { username: 'johndoe', name: 'John Doe' }

function normalize(apiComment: any): Comment {
  return {
    id: apiComment.id,
    userId: apiComment.user_id || apiComment.user?.id || '', // ID của người tạo comment
    author: {
      name: apiComment.user?.display_name || apiComment.user?.username || 'Unknown',
      username: apiComment.user?.username || apiComment.user?.id || 'unknown',
      avatar: apiComment.user?.avatar_url || '/default-avatar.jpg',
    },
    content: apiComment.content,
    createdAt: new Date(apiComment.created_at),
    is_edited: !!apiComment.is_edited,
  }
}

interface CommentSectionProps {
  postId: string
  postAuthorId?: string // ID của tác giả bài viết
}

export default function CommentSection({ postId, postAuthorId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Get current user ID from token
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        console.log('🔑 User ID from token:', payload.userId)
        setCurrentUserId(payload.userId || null)
      } catch (err) {
        console.error('❌ Error parsing token:', err)
      }
    }
  }, [])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        console.log('📥 Loading comments for post:', postId)

        const res = await fetch(`http://localhost:3000/api/posts/${postId}/comments`)
        if (!res.ok) {
          console.error('❌ Failed to load comments, status:', res.status)
          return
        }

        const data = await res.json()
        if (!mounted) return

        console.log('✅ Loaded comments:', data)

        // Handle both direct array or nested data structure
        const commentsArray = Array.isArray(data) ? data : (data.data?.comments || data.comments || [])

        console.log('📋 Raw comments before normalize:', commentsArray)
        console.log('📋 First comment user_id:', commentsArray[0]?.user_id)

        const normalizedComments = commentsArray.map(normalize)
        console.log('📋 Normalized comments:', normalizedComments)
        console.log('📋 First normalized comment userId:', normalizedComments[0]?.userId)

        setComments(normalizedComments)
      } catch (err) {
        console.error('❌ Error loading comments:', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [postId])

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      // Get auth token
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1]

      if (!authToken) {
        alert('Please login to comment')
        return
      }

      console.log('📝 Creating comment for post:', postId)

      const res = await fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ content: newComment }),
      })

      console.log('📝 Comment response status:', res.status)

      if (!res.ok) {
        const error = await res.json()
        console.error('❌ Comment creation error:', error)
        throw new Error('Failed to create comment')
      }

      const responseData = await res.json()
      console.log('✅ Comment created:', responseData)

      // Backend returns { success: true, data: { comment: {...} } }
      const created = responseData.data?.comment || responseData.data || responseData
      setComments(prev => [normalize(created), ...prev])
      setNewComment('')
    } catch (err) {
      console.error('❌ Error adding comment:', err)
      alert('Failed to add comment. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return
    try {
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1]

      if (!authToken) {
        alert('Please login to delete comments')
        return
      }

      console.log('🗑️ Deleting comment:', id)

      const res = await fetch(`http://localhost:3000/api/comments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      })

      if (res.ok) {
        console.log('✅ Comment deleted')
        setComments(prev => prev.filter(c => c.id !== id))
      } else {
        const error = await res.json()
        console.error('❌ Delete error:', error)
        throw new Error('Failed to delete')
      }
    } catch (err) {
      console.error('❌ Error deleting comment:', err)
      alert('Failed to delete comment')
    }
  }

  const startEdit = (c: Comment) => {
    setEditingId(c.id)
    setEditingContent(c.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingContent('')
  }

  const saveEdit = async (id: string) => {
    if (!editingContent.trim()) return
    try {
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1]

      if (!authToken) {
        alert('Please login to edit comments')
        return
      }

      console.log('✏️ Updating comment:', id)

      const res = await fetch(`http://localhost:3000/api/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ content: editingContent }),
      })

      if (!res.ok) {
        const error = await res.json()
        console.error('❌ Edit error:', error)
        throw new Error('Failed to update')
      }

      const responseData = await res.json()
      console.log('✅ Comment updated:', responseData)

      // Backend returns { success: true, data: { comment: {...} } }
      const updated = responseData.data?.comment || responseData.data || responseData
      setComments(prev => prev.map(c => (c.id === id ? { ...c, content: updated.content, is_edited: !!updated.is_edited } : c)))
      cancelEdit()
    } catch (err) {
      console.error('❌ Error updating comment:', err)
      alert('Failed to update comment')
      cancelEdit()
    }
  }

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return 'now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const CommentItem = ({ comment, isReply }: { comment: Comment; isReply?: boolean }) => {
    // Check permissions:
    // 1. Comment owner can edit and delete their own comment
    // 2. Post author can delete (but not edit) any comment in their post

    // Debug: Log all values
    console.log('🔍 Comment permission check:', {
      commentId: comment.id,
      'comment.userId': comment.userId,
      'comment.author.username': comment.author.username,
      currentUserId,
      postAuthorId,
      'typeof comment.userId': typeof comment.userId,
      'typeof currentUserId': typeof currentUserId
    })

    const isCommentOwner = currentUserId && comment.userId && comment.userId === currentUserId
    const isPostOwner = currentUserId && postAuthorId && currentUserId === postAuthorId

    const canEdit = !!isCommentOwner
    const canDelete = !!(isCommentOwner || isPostOwner)

    console.log('✅ Final permissions:', {
      isCommentOwner,
      isPostOwner,
      canEdit,
      canDelete
    })

    return (
      <div className={`flex gap-3 ${isReply ? 'ml-10 pb-3' : 'pb-4'}`}>
        <img
          src={comment.author.avatar || '/default-avatar.jpg'}
          alt={comment.author.name}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="bg-secondary rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="font-semibold text-sm text-foreground">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground ml-2">@{comment.author.username}</span>
                {comment.is_edited && <span className="ml-2 text-[10px] text-muted-foreground">(edited)</span>}
                {isPostOwner && !isCommentOwner && <span className="ml-2 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">You can delete</span>}
              </div>
              {(canEdit || canDelete) && (
                <div className="flex items-center gap-2">
                  {editingId === comment.id ? (
                    <>
                      <Button size="sm" onClick={() => saveEdit(comment.id)} className="text-xs">Save</Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit} className="text-xs"><X className="w-3 h-3" /></Button>
                    </>
                  ) : (
                    <>
                      {canEdit && <button onClick={() => startEdit(comment)} className="text-xs hover:text-foreground" title="Edit comment"><Edit2 className="w-4 h-4" /></button>}
                      {canDelete && <button onClick={() => handleDelete(comment.id)} className="text-xs hover:text-destructive" title={isPostOwner && !isCommentOwner ? "Delete comment (as post author)" : "Delete your comment"}><Trash2 className="w-4 h-4" /></button>}
                    </>
                  )}
                </div>
              )}
            </div>

            {editingId === comment.id ? (
              <div className="mt-2">
                <Input value={editingContent} onChange={(e) => setEditingContent(e.target.value)} className="text-sm" />
              </div>
            ) : (
              <p className="text-sm text-foreground break-words">{comment.content}</p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>{timeAgo(comment.createdAt)}</span>
            <button className="hover:text-destructive transition">Reply</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-4">
      {/* New Comment Input */}
      <div className="flex gap-3 pb-4 border-b border-border">
        <img
          src="/default-avatar.jpg"
          alt="Your avatar"
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            className="text-sm border border-border"
          />
          <Button
            size="sm"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="bg-primary hover:bg-primary/90"
          >
            Post
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-1">
        {comments.map(comment => (
          <div key={comment.id}>
            <CommentItem comment={comment} />
            {comment.replies && comment.replies.map(reply => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}