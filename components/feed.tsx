'use client'

import { useState } from 'react'
import CreatePost from '@/components/create-post'
import PostCard from '@/components/post-card'

const mockPosts = [
  {
    id: '1',
    author: {
      id: 'user-1',
      name: 'Sarah Chen',
      username: 'sarahchen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      bio: 'Product Designer & Coffee Enthusiast'
    },
    title: 'The Future of Design Systems in 2025',
    excerpt: 'Exploring how AI and automation are reshaping the way we build design systems. From component generation to automated testing...',
    content: 'The landscape of design systems is rapidly evolving. Companies are now leveraging AI to generate components, automate testing, and even predict design patterns. This shift is not just about efficiency—it\'s fundamentally changing how designers and developers collaborate.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    tags: ['design', 'technology', 'ai'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 342,
    comments: 28,
    isLiked: false,
    isSaved: false,
  },
  {
    id: '2',
    author: {
      id: 'user-2',
      name: 'Marcus Johnson',
      username: 'marcusj',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      bio: 'Full Stack Developer | Open Source Contributor'
    },
    title: 'Building Scalable React Applications',
    excerpt: 'Best practices and patterns I\'ve learned building applications at scale. Including state management, code splitting, and performance optimization...',
    content: 'After working on projects that handle millions of users, I\'ve identified key patterns that make React applications scalable. Let me share what I\'ve learned about managing complexity.',
    image: 'https://images.unsplash.com/photo-1633356713697-d5daa3b83203?w=600&h=400&fit=crop',
    tags: ['react', 'web-development', 'performance'],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    likes: 215,
    comments: 42,
    isLiked: true,
    isSaved: false,
  },
  {
    id: '3',
    author: {
      id: 'user-3',
      name: 'Elena Rodriguez',
      username: 'elenrod',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
      bio: 'UX Researcher | Accessibility Advocate'
    },
    title: 'Why Accessibility Isn\'t Optional',
    excerpt: 'A compelling case for making accessibility a core principle, not an afterthought. Real stories from users with disabilities...',
    content: 'Accessibility isn\'t just about compliance—it\'s about inclusion. When we design for people with disabilities, we create better products for everyone. Let me share some insights from recent research.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    tags: ['accessibility', 'ux', 'design'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    likes: 567,
    comments: 89,
    isLiked: false,
    isSaved: true,
  },
]

export default function Feed() {
  const [posts, setPosts] = useState(mockPosts)

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const handleSave = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, isSaved: !post.isSaved } : post
    ))
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <CreatePost />
      {posts.map((post) => (
        <PostCard 
          key={post.id} 
          post={post} 
          onLike={handleLike}
          onSave={handleSave}
        />
      ))}
    </div>
  )
}
