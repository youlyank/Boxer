'use client'

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  Send, 
  Circle, 
  Play, 
  MessageSquare, 
  User,
  Eye,
  Code2
} from 'lucide-react'

interface CollaborativeEditorProps {
  projectId: string
  username: string
  initialCode?: string
  language?: string
  onCodeChange?: (code: string) => void
}

interface ActiveUser {
  id: string
  username: string
  color: string
  isTyping?: boolean
}

interface ChatMessage {
  id: string
  userId: string
  username: string
  userColor: string
  message: string
  timestamp: string
}

export default function CollaborativeEditor({
  projectId,
  username,
  initialCode = '',
  language = 'javascript',
  onCodeChange
}: CollaborativeEditorProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [code, setCode] = useState(initialCode)
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [executionOutput, setExecutionOutput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const socketInstance = io('/api/socket', {
      path: '/api/socket/io'
    })

    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket server')
      setIsConnected(true)
      socketInstance.emit('join-project', projectId)
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
      setIsConnected(false)
    })

    // Room events
    socketInstance.on('room-joined', (data) => {
      setActiveUsers(data.activeUsers.map((userId: string) => ({
        id: userId,
        username: userId === socketInstance.id ? username : 'Collaborator',
        color: data.userColor,
        isTyping: false
      })))
    })

    socketInstance.on('user-joined', (data) => {
      setActiveUsers(prev => [...prev.filter(u => u.id !== data.userId), {
        id: data.userId,
        username: 'Collaborator',
        color: data.userColor,
        isTyping: false
      }])
    })

    socketInstance.on('user-left', (data) => {
      setActiveUsers(prev => prev.filter(u => u.id !== data.userId))
    })

    // Code collaboration events
    socketInstance.on('code-changed', (data) => {
      if (data.userId !== socketInstance.id) {
        setCode(data.code)
        if (onCodeChange) {
          onCodeChange(data.code)
        }
      }
    })

    socketInstance.on('language-changed', (data) => {
      if (data.userId !== socketInstance.id) {
        // Handle language change from other users
        console.log(`Language changed to ${data.language} by ${data.userId}`)
      }
    })

    // Typing indicators
    socketInstance.on('user-typing', (data) => {
      setActiveUsers(prev => prev.map(user => 
        user.id === data.userId 
          ? { ...user, isTyping: data.isTyping }
          : user
      ))
    })

    // Chat events
    socketInstance.on('new-message', (message: ChatMessage) => {
      setChatMessages(prev => [...prev, message])
    })

    // Execution events
    socketInstance.on('code-running', (data) => {
      setIsExecuting(true)
      setExecutionOutput('Someone is running the code...')
    })

    socketInstance.on('execution-complete', (data) => {
      setIsExecuting(false)
      setExecutionOutput(data.error ? `❌ Error: ${data.output}` : `✅ Output:\n${data.output}`)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.emit('leave-project', projectId)
      socketInstance.disconnect()
    }
  }, [projectId, username])

  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
    if (onCodeChange) {
      onCodeChange(newCode)
    }

    // Emit code change to other users
    if (socket) {
      socket.emit('code-change', {
        projectId,
        code: newCode
      })

      // Handle typing indicator
      if (!isTyping) {
        setIsTyping(true)
        socket.emit('typing-start', { projectId, username })
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false)
        if (socket) {
          socket.emit('typing-stop', { projectId })
        }
      }, 1000)
    }
  }

  const handleSendMessage = () => {
    if (messageInput.trim() && socket) {
      socket.emit('send-message', {
        projectId,
        message: messageInput.trim(),
        username
      })
      setMessageInput('')
    }
  }

  const handleRunCode = async () => {
    if (socket) {
      socket.emit('run-code', { projectId, code, language })
      setIsExecuting(true)
      setExecutionOutput('Running code...')

      try {
        const response = await fetch('/api/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language })
        })

        const result = await response.json()
        
        socket.emit('execution-result', {
          projectId,
          output: result.output || result.error,
          error: !!result.error
        })

        setExecutionOutput(result.error ? `❌ Error: ${result.error}` : `✅ Output:\n${result.output}`)
      } catch (error) {
        const errorMsg = 'Network Error: Failed to execute code'
        socket.emit('execution-result', {
          projectId,
          output: errorMsg,
          error: true
        })
        setExecutionOutput(`❌ ${errorMsg}`)
      } finally {
        setIsExecuting(false)
      }
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypingUsers = () => {
    return activeUsers.filter(user => user.isTyping && user.id !== socket?.id)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-full">
      {/* Main Editor */}
      <div className="lg:col-span-3 space-y-4">
        {/* Header */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Circle className={`w-3 h-3 ${isConnected ? 'text-green-500' : 'text-red-500'} fill-current`} />
                  <span className="text-sm font-medium">
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <Badge variant="secondary">{language}</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {activeUsers.slice(0, 3).map((user) => (
                    <Avatar key={user.id} className="w-6 h-6 border-2 border-background">
                      <AvatarFallback style={{ backgroundColor: user.color, color: 'white' }}>
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {activeUsers.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-background flex items-center justify-center">
                      <span className="text-xs font-medium">+{activeUsers.length - 3}</span>
                    </div>
                  )}
                </div>
                <Button size="sm" onClick={handleRunCode} disabled={isExecuting}>
                  <Play className="w-4 h-4 mr-1" />
                  {isExecuting ? 'Running...' : 'Run'}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Code Editor */}
        <Card className="flex-1">
          <CardContent className="p-0">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                className="w-full h-96 p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none outline-none"
                style={{ 
                  tabSize: 2,
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
                }}
                placeholder="Start collaborating on code..."
              />
              
              {/* Typing indicator */}
              {getTypingUsers().length > 0 && (
                <div className="absolute bottom-2 left-2 text-xs text-gray-400">
                  {getTypingUsers().map(user => user.username).join(', ')} 
                  {getTypingUsers().length === 1 ? ' is' : ' are'} typing...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Output Console */}
        {executionOutput && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <Code2 className="w-4 h-4 mr-2" />
                Output Console
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-black text-green-400 p-3 rounded text-sm font-mono overflow-auto max-h-32">
                {executionOutput}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Active Users */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Active Users ({activeUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback style={{ backgroundColor: user.color, color: 'white' }}>
                    {user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.username}</p>
                  {user.isTyping && (
                    <p className="text-xs text-gray-500">Typing...</p>
                  )}
                </div>
                {user.id === socket?.id && (
                  <Badge variant="outline" className="text-xs">You</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatMessages.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center">No messages yet</p>
                ) : (
                  chatMessages.map((message) => (
                    <div key={message.id} className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-4 h-4">
                          <AvatarFallback 
                            style={{ backgroundColor: message.userColor, color: 'white' }}
                            className="text-xs"
                          >
                            {message.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{message.username}</span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 ml-6">
                        {message.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            
            <Separator />
            
            <div className="p-3">
              <div className="flex space-x-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSendMessage}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}