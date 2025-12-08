'use client'

import { Heart, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'

const trendingTopics = [
  { tag: '#WebDevelopment', posts: 12500 },
  { tag: '#Design', posts: 8900 },
  { tag: '#Technology', posts: 15200 },
  { tag: '#Startup', posts: 4200 },
]

const suggestedUsers = [
  { name: 'Emma Watson', username: 'emmaw', followers: '245K' },
  { name: 'David Chen', username: 'davidchen', followers: '189K' },
  { name: 'Lisa Park', username: 'lisapark', followers: '156K' },
]

export default function RightSidebar() {
  return (
    <aside className="hidden xl:block w-80 space-y-6">
      {/* Trending */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Trending Now
        </h2>
        <div className="space-y-3">
          {trendingTopics.map(topic => (
            <div key={topic.tag} className="p-3 rounded-lg hover:bg-secondary transition cursor-pointer">
              <div className="font-semibold text-foreground text-sm">{topic.tag}</div>
              <div className="text-xs text-muted-foreground">{topic.posts.toLocaleString()} posts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-accent" />
          Suggested People
        </h2>
        <div className="space-y-3">
          {suggestedUsers.map(user => (
            <div key={user.username} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary transition">
              <div className="flex-1">
                <div className="font-semibold text-sm text-foreground">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.followers} followers</div>
              </div>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs">Follow</Button>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Promotion */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-accent fill-accent" />
          <h3 className="font-bold text-foreground">Upgrade to Pro</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Get advanced analytics, scheduled posts, and more.</p>
        <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-xs">Upgrade Now</Button>
      </div>
    </aside>
  )
}
