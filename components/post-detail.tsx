import CommentSection from '@/components/comment-section'

interface Post {
  id: string
  title: string
  excerpt?: string
  content: string
  image?: string
  featured_image_url?: string
  tags: string[]
  author: {
    id: string
    name?: string
    display_name?: string
    username?: string
    avatar?: string
    avatar_url?: string
  }
  createdAt?: string
  created_at?: string
  published_at?: string
}

export default function PostDetail({ post }: { post: Post }) {
  const authorName = post.author?.name || post.author?.display_name || post.author?.username || 'Unknown'
  const authorAvatar = post.author?.avatar || post.author?.avatar_url || '/default-avatar.jpg'
  const image = post.image || post.featured_image_url
  const createdAt = post.createdAt || post.created_at || post.published_at

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">{post.title}</h1>
        <div className="flex items-center gap-3 mt-3">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="text-sm font-semibold text-foreground">{authorName}</div>
            {post.author?.username && (
              <div className="text-xs text-muted-foreground">@{post.author.username}</div>
            )}
          </div>
        </div>
      </div>

      {image && (
        <div className="rounded-lg overflow-hidden mb-6">
          <img src={image} alt={post.title} className="w-full h-auto object-cover" />
        </div>
      )}

      <div className="prose prose-invert max-w-none text-foreground">
        {post.content}
      </div>

      <div className="mt-8">
        <CommentSection postId={post.id} />
      </div>
    </div>
  )
}
