'use client'

import { useState, useRef } from 'react'
import { ImageIcon, Tag, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface CreatePostProps {
  onPostCreated?: () => void
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    setCoverImage(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setCoverImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setCoverImage(null)
    setCoverImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handlePost = async () => {
    if (!content.trim()) {
      setError('Content is required')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Get auth token from cookie
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1]

      if (!authToken) {
        setError('Please login to create a post')
        return
      }

      let coverImageUrl = null

      // Upload cover image if selected
      if (coverImage) {
        setIsUploadingImage(true)
        const imageFormData = new FormData()
        imageFormData.append('cover', coverImage)

        const uploadResponse = await fetch('/api/upload/post-cover', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          body: imageFormData,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          // Backend returns: { success: true, data: { cover_url: "..." }, message: "..." }
          coverImageUrl = uploadData.data?.cover_url || uploadData.cover_url || uploadData.url
          console.log('✅ Upload response:', uploadData)
          console.log('✅ Cover image URL:', coverImageUrl)
        } else {
          const errorData = await uploadResponse.json()
          console.error('❌ Upload error:', errorData)
        }
        setIsUploadingImage(false)
      }

      // Create post - use first 50 chars of content as title if not provided
      const autoTitle = content.trim().substring(0, 50) + (content.length > 50 ? '...' : '')
      const postData = {
        title: autoTitle,
        content: content.trim(),
        featured_image_url: coverImageUrl,
        status: 'published',
      }
      console.log('Creating post with data:', postData)

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(postData),
      })

      console.log('Create post response status:', response.status)

      if (!response.ok) {
        const data = await response.json()
        console.error('❌ Create post error:', data)
        throw new Error(data.error?.message || data.message || 'Failed to create post')
      }

      const responseData = await response.json()
      console.log('✅ Post created successfully:', responseData)

      // Success
      setContent('')
      setCoverImage(null)
      setCoverImagePreview(null)
      setIsOpen(false)

      // Notify parent to refresh posts
      if (onPostCreated) {
        onPostCreated()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post')
    } finally {
      setIsLoading(false)
      setIsUploadingImage(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
      <div className="flex gap-3">
        <img
          src="/default-avatar.jpg"
          alt="User avatar"
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
        
        {!isOpen ? (
          <div
            onClick={() => setIsOpen(true)}
            className="flex-1 bg-secondary rounded-full px-4 py-3 text-muted-foreground cursor-pointer hover:bg-muted transition"
          >
            What's on your mind?
          </div>
        ) : (
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-24 border border-border resize-none"
            />

            {/* Image Preview */}
            {coverImagePreview && (
              <div className="relative">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-lg border border-border"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-destructive text-white rounded-full hover:bg-destructive/90 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex gap-2 justify-between items-center">
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="p-2 hover:bg-secondary rounded-lg transition text-muted-foreground disabled:opacity-50"
                >
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
                    setContent('')
                    setCoverImage(null)
                    setCoverImagePreview(null)
                    setError('')
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePost}
                  disabled={!content.trim() || isLoading || isUploadingImage}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isLoading ? (isUploadingImage ? 'Uploading...' : 'Posting...') : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
