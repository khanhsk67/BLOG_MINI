import PostDetail from '@/components/post-detail'
import { mockPosts } from '@/lib/mock-posts'

interface Params {
  params: { id: string }
}

export default async function PostPage({ params }: Params) {
  const { id } = await params

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/api/posts/${id}`, { cache: 'no-store' })

    if (res.ok) {
      const post = await res.json()
      return <PostDetail post={post} />
    }

    // Fallback to local mock data if API returned an error
    const local = mockPosts.find(p => p.id === id || p.slug === id)
    if (local) return <PostDetail post={local} />

    throw new Error('Post not found')
  } catch (error) {
    // Try fallback again (covers network errors)
    const local = mockPosts.find(p => p.id === id || p.slug === id)
    if (local) return <PostDetail post={local} />

    return (
      <div className="max-w-3xl mx-auto py-8 text-foreground">
        <h2 className="text-xl font-semibold">Post not found</h2>
        <p className="text-muted-foreground">The post you are looking for does not exist or there was an error loading it.</p>
      </div>
    )
  }
}
