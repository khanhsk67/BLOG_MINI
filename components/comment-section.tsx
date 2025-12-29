'use client'

import { useEffect, useState } from 'react'
import { Trash2, Edit2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Comment {
  id: string
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
    author: {
      name: apiComment.user?.display_name || apiComment.user?.username || 'Unknown',
      username: apiComment.user?.username || apiComment.user?.id || 'unknown',
      avatar: apiComment.user?.avatar_url || '/placeholder.svg',
    },
    content: apiComment.content,
    createdAt: new Date(apiComment.created_at),
    is_edited: !!apiComment.is_edited,
  }
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(`/api/comments?post_id=${postId}`)
        if (!res.ok) return
        const data = await res.json()
        if (!mounted) return
        setComments(data.comments.map(normalize))
      } catch (err) {
        // ignore — keep empty
      }
    }
    load()
    return () => { mounted = false }
  }, [postId])

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId, content: newComment }),
      })
      if (!res.ok) throw new Error('Failed')
      const created = await res.json()
      setComments(prev => [normalize(created), ...prev])
      setNewComment('')
    } catch (err) {
      // fallback: optimistic local add
      const comment: Comment = {
        id: Date.now().toString(),
        author: { 
          name: CURRENT_USER.name, 
          username: CURRENT_USER.username,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
        },
        content: newComment,
        createdAt: new Date(),
      }
      setComments(prev => [comment, ...prev])
      setNewComment('')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this comment?')) return
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' })
      if (res.ok) setComments(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      // optimistic local delete
      setComments(prev => prev.filter(c => c.id !== id))
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
      const res = await fetch(`/api/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingContent }),
      })
      if (!res.ok) throw new Error('Failed')
      const updated = await res.json()
      setComments(prev => prev.map(c => (c.id === id ? { ...c, content: updated.content, is_edited: !!updated.is_edited } : c)))
      cancelEdit()
    } catch (err) {
      // optimistic local update
      setComments(prev => prev.map(c => (c.id === id ? { ...c, content: editingContent, is_edited: true } : c)))
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
    const isOwner = comment.author.username === CURRENT_USER.username

    return (
      <div className={`flex gap-3 ${isReply ? 'ml-10 pb-3' : 'pb-4'}`}>
        <img
          src={comment.author.avatar || '/placeholder.svg'}
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
              </div>
              {isOwner && (
                <div className="flex items-center gap-2">
                  {editingId === comment.id ? (
                    <>
                      <Button size="sm" onClick={() => saveEdit(comment.id)} className="text-xs">Save</Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit} className="text-xs"><X className="w-3 h-3" /></Button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(comment)} className="text-xs hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(comment.id)} className="text-xs hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
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
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
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