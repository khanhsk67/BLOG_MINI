'use client'

import { useState } from 'react'
import { ImageIcon, Tag, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export default function CreatePost() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const handlePost = () => {
    if (title.trim() || content.trim()) {
      // Handle post creation
      setTitle('')
      setContent('')
      setIsOpen(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground font-semibold">
          JD
        </div>
        
        {!isOpen ? (
          <div 
            onClick={() => setIsOpen(true)}
            className="flex-1 bg-secondary rounded-full px-4 py-3 text-muted-foreground cursor-pointer hover:bg-muted transition"
          >
            What's on your mind?
          </div>
        ) : (
          <div className="flex-1 space-y-3">
            <Input 
              type="text"
              placeholder="Post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-border"
            />
            <Textarea 
              placeholder="Share your thoughts, story, or experience..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-24 border border-border resize-none"
            />
            
            <div className="flex gap-2 justify-between items-center">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-secondary rounded-lg transition text-muted-foreground">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-secondary rounded-lg transition text-muted-foreground">
                  <Tag className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-secondary rounded-lg transition text-muted-foreground">
                  <FileText className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsOpen(false)
                    setTitle('')
                    setContent('')
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handlePost}
                  disabled={!title.trim() && !content.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
