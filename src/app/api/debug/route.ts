import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { projectId, userId, code, language, breakpoints } = await request.json()

    if (!projectId || !userId) {
      return NextResponse.json({ 
        error: 'Project ID and user ID are required' 
      }, { status: 400 })
    }

    // Check if debug session already exists
    const existingSession = await db.debugSession.findFirst({
      where: { 
        projectId, 
        userId,
        isActive: true 
      }
    })

    let debugSession
    if (existingSession) {
      // Update existing session
      debugSession = await db.debugSession.update({
        where: { id: existingSession.id },
        data: {
          breakpoints: JSON.stringify(breakpoints || []),
          updatedAt: new Date()
        }
      })
    } else {
      // Create new debug session
      debugSession = await db.debugSession.create({
        data: {
          projectId,
          userId,
          breakpoints: JSON.stringify(breakpoints || []),
          isActive: true
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        debugSession,
        message: 'Debug session started successfully'
      }
    })

  } catch (error: any) {
    console.error('Debug Session Error:', error)
    return NextResponse.json({ 
      error: 'Failed to start debug session',
      details: error.message 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { sessionId, variables, consoleOutput } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ 
        error: 'Session ID is required' 
      }, { status: 400 })
    }

    // Update debug session with new data
    const updateData: any = { updatedAt: new Date() }
    
    if (variables) {
      updateData.variables = JSON.stringify(variables)
    }
    
    if (consoleOutput) {
      const currentSession = await db.debugSession.findUnique({
        where: { id: sessionId }
      })
      
      if (currentSession) {
        const currentConsole = JSON.parse(currentSession.console || '[]')
        currentConsole.push({
          timestamp: new Date().toISOString(),
          output: consoleOutput,
          type: 'log'
        })
        updateData.console = JSON.stringify(currentConsole)
      }
    }

    const debugSession = await db.debugSession.update({
      where: { id: sessionId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      data: {
        debugSession,
        message: 'Debug session updated successfully'
      }
    })

  } catch (error: any) {
    console.error('Debug Update Error:', error)
    return NextResponse.json({ 
      error: 'Failed to update debug session',
      details: error.message 
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ 
        error: 'Session ID is required' 
      }, { status: 400 })
    }

    // End debug session
    await db.debugSession.update({
      where: { id: sessionId },
      data: { 
        isActive: false,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        message: 'Debug session ended successfully'
      }
    })

  } catch (error: any) {
    console.error('Debug End Error:', error)
    return NextResponse.json({ 
      error: 'Failed to end debug session',
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const userId = searchParams.get('userId')

    if (!projectId || !userId) {
      return NextResponse.json({ 
        error: 'Project ID and user ID are required' 
      }, { status: 400 })
    }

    // Get active debug session
    const debugSession = await db.debugSession.findFirst({
      where: { 
        projectId, 
        userId,
        isActive: true 
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        debugSession,
        isActive: !!debugSession
      }
    })

  } catch (error: any) {
    console.error('Debug Fetch Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch debug session',
      details: error.message 
    }, { status: 500 })
  }
}