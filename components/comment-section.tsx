'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
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
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Alex Kim',
      username: 'alexkim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    content: 'This is such an insightful perspective! Really appreciate you sharing this.',
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    replies: [
      {
        id: '1-1',
        author: {
          name: 'Sarah Chen',
          username: 'sarahchen',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        },
        content: 'Thank you, Alex! Would love to hear more about your experience.',
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      }
    ]
  },
  {
    id: '2',
    author: {
      name: 'Jordan Lee',
      username: 'jordanlee',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    },
    content: 'Could you elaborate on the implementation details?',
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
  }
]

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState('')

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: {
          name: 'John Doe',
          username: 'johndoe',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        },
        content: newComment,
        createdAt: new Date(),
      }
      setComments([comment, ...comments])
      setNewComment('')
    }
  }

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return 'now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const CommentItem = ({ comment, isReply }: { comment: Comment; isReply?: boolean }) => (
    <div className={`flex gap-3 ${isReply ? 'ml-10 pb-3' : 'pb-4'}`}>
      <img 
        src={comment.author.avatar || "/placeholder.svg"}
        alt={comment.author.name}
        className="w-8 h-8 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="bg-secondary rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="font-semibold text-sm text-foreground">{comment.author.name}</span>
              <span className="text-xs text-muted-foreground ml-2">@{comment.author.username}</span>
            </div>
          </div>
          <p className="text-sm text-foreground break-words">{comment.content}</p>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>{timeAgo(comment.createdAt)}</span>
          <button className="hover:text-destructive transition">Reply</button>
        </div>
      </div>
    </div>
  )

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
