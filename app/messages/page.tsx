'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle, Send, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Conversation {
  user: {
    id: string
    username: string
    display_name: string
    avatar_url: string
  }
  last_message: string
  last_message_time: string
  unread_count: number
}

interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
  sender: {
    id: string
    username: string
    display_name: string
    avatar_url: string
  }
}

export default function MessagesPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Get current user ID
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setCurrentUserId(payload.id)
    } catch (err) {
      console.error('Error parsing token:', err)
    }

    loadConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation)
    }
  }, [selectedConversation])

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/messages/conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(data.data.conversations || [])
      }
    } catch (err) {
      console.error('Error loading conversations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3000/api/messages/conversation/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.data.messages || [])
      }
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedConversation) return

    setIsSending(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recipient_id: selectedConversation,
          content: newMessage.trim()
        })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages([...messages, data.data])
        setNewMessage('')
        loadConversations() // Refresh conversation list
      } else {
        alert('Failed to send message')
      }
    } catch (err) {
      console.error('Error sending message:', err)
      alert('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return 'now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    )
  }

  const selectedUser = conversations.find(c => c.user.id === selectedConversation)?.user

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="bg-card border border-border rounded-lg overflow-hidden" style={{ height: 'calc(100vh - 2rem)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r border-border flex flex-col`}>
              <div className="p-4 border-b border-border">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Messages
                </h1>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No conversations yet</p>
                    <p className="text-sm mt-2">Start chatting with someone!</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.user.id}
                      onClick={() => setSelectedConversation(conv.user.id)}
                      className={`p-4 border-b border-border cursor-pointer hover:bg-secondary transition ${
                        selectedConversation === conv.user.id ? 'bg-secondary' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={conv.user.avatar_url || '/default-avatar.jpg'}
                          alt={conv.user.display_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-foreground truncate">
                              {conv.user.display_name}
                            </h3>
                            <span className="text-xs text-muted-foreground">
                              {timeAgo(conv.last_message_time)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {conv.last_message}
                          </p>
                          {conv.unread_count > 0 && (
                            <span className="inline-block mt-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                              {conv.unread_count} new
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className={`${selectedConversation ? 'block' : 'hidden md:block'} w-full md:w-2/3 flex flex-col`}>
              {selectedConversation && selectedUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 hover:bg-secondary rounded-full"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <img
                      src={selectedUser.avatar_url || '/default-avatar.jpg'}
                      alt={selectedUser.display_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="font-semibold">{selectedUser.display_name}</h2>
                      <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage = message.sender_id === currentUserId
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwnMessage
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-foreground'
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{message.content}</p>
                            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                              {timeAgo(message.created_at)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Message Input */}
                  <form onSubmit={sendMessage} className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={isSending}
                      />
                      <Button type="submit" disabled={isSending || !newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
