import { NextRequest, NextResponse } from 'next/server'
import { Server as NetServer } from 'http'
import { createServer as createHttpServer } from 'http'
import { Server as ServerIO } from 'socket.io'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Socket.IO server instance
let io: ServerIO | null = null

const SocketHandler = (req: NextRequest) => {
  if (!io) {
    console.log('Socket is initializing')
    
    // This is a workaround for Next.js App Router
    const httpServer = createHttpServer()
    io = new ServerIO(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    // Store active rooms and users
    const rooms = new Map<string, Set<string>>()
    const userColors = new Map<string, string>()

    // Generate random color for users
    const getUserColor = (userId: string) => {
      if (!userColors.has(userId)) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
        userColors.set(userId, colors[Math.floor(Math.random() * colors.length)])
      }
      return userColors.get(userId)
    }

    io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      // Join a project room
      socket.on('join-project', (projectId: string) => {
        socket.join(projectId)
        
        if (!rooms.has(projectId)) {
          rooms.set(projectId, new Set())
        }
        rooms.get(projectId)!.add(socket.id)

        // Notify others in the room
        socket.to(projectId).emit('user-joined', {
          userId: socket.id,
          userColor: getUserColor(socket.id),
          activeUsers: Array.from(rooms.get(projectId)!)
        })

        // Send current room info to the new user
        socket.emit('room-joined', {
          projectId,
          activeUsers: Array.from(rooms.get(projectId)!),
          userColor: getUserColor(socket.id)
        })

        console.log(`User ${socket.id} joined project ${projectId}`)
      })

      // Leave a project room
      socket.on('leave-project', (projectId: string) => {
        socket.leave(projectId)
        
        if (rooms.has(projectId)) {
          rooms.get(projectId)!.delete(socket.id)
          if (rooms.get(projectId)!.size === 0) {
            rooms.delete(projectId)
          }
        }

        // Notify others in the room
        socket.to(projectId).emit('user-left', {
          userId: socket.id,
          activeUsers: rooms.get(projectId) ? Array.from(rooms.get(projectId)!) : []
        })

        console.log(`User ${socket.id} left project ${projectId}`)
      })

      // Code change events
      socket.on('code-change', (data: { projectId: string; code: string; cursor?: any }) => {
        socket.to(data.projectId).emit('code-changed', {
          userId: socket.id,
          userColor: getUserColor(socket.id),
          code: data.code,
          cursor: data.cursor,
          timestamp: new Date().toISOString()
        })
      })

      // Cursor position events
      socket.on('cursor-move', (data: { projectId: string; position: number; selection?: { start: number; end: number } }) => {
        socket.to(data.projectId).emit('cursor-moved', {
          userId: socket.id,
          userColor: getUserColor(socket.id),
          position: data.position,
          selection: data.selection,
          timestamp: new Date().toISOString()
        })
      })

      // Language change events
      socket.on('language-change', (data: { projectId: string; language: string }) => {
        socket.to(data.projectId).emit('language-changed', {
          userId: socket.id,
          language: data.language,
          timestamp: new Date().toISOString()
        })
      })

      // Chat/message events
      socket.on('send-message', (data: { projectId: string; message: string; username: string }) => {
        const messageData = {
          id: Date.now().toString(),
          userId: socket.id,
          userColor: getUserColor(socket.id),
          username: data.username || 'Anonymous',
          message: data.message,
          timestamp: new Date().toISOString()
        }

        io.to(data.projectId).emit('new-message', messageData)
      })

      // Typing indicator
      socket.on('typing-start', (data: { projectId: string; username: string }) => {
        socket.to(data.projectId).emit('user-typing', {
          userId: socket.id,
          username: data.username || 'Anonymous',
          isTyping: true
        })
      })

      socket.on('typing-stop', (data: { projectId: string }) => {
        socket.to(data.projectId).emit('user-typing', {
          userId: socket.id,
          isTyping: false
        })
      })

      // Project execution events
      socket.on('run-code', (data: { projectId: string; code: string; language: string }) => {
        // Broadcast to all users in the room that code is running
        io.to(data.projectId).emit('code-running', {
          userId: socket.id,
          userColor: getUserColor(socket.id),
          timestamp: new Date().toISOString()
        })
      })

      socket.on('execution-result', (data: { projectId: string; output: string; error?: boolean }) => {
        socket.to(data.projectId).emit('execution-complete', {
          userId: socket.id,
          userColor: getUserColor(socket.id),
          output: data.output,
          error: data.error,
          timestamp: new Date().toISOString()
        })
      })

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
        
        // Remove user from all rooms
        rooms.forEach((users, projectId) => {
          if (users.has(socket.id)) {
            users.delete(socket.id)
            socket.to(projectId).emit('user-left', {
              userId: socket.id,
              activeUsers: Array.from(users)
            })
            
            if (users.size === 0) {
              rooms.delete(projectId)
            }
          }
        })

        userColors.delete(socket.id)
      })
    })

    // Start the server
    const PORT = process.env.SOCKET_PORT || 3001
    httpServer.listen(PORT, () => {
      console.log(`Socket.IO server running on port ${PORT}`)
    })
  }

  return NextResponse.json({ message: 'Socket server initialized' })
}

export { SocketHandler as GET, SocketHandler as POST }