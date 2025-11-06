import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { projectId, shareType = 'public', permissions = 'read' } = await request.json()

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Generate a unique share link
    const shareId = generateShareId()
    const shareLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/shared/${shareId}`

    // In a real application, you would save this to a database
    const shareData = {
      shareId,
      projectId,
      shareType,
      permissions,
      createdAt: new Date().toISOString(),
      expiresAt: shareType === 'temporary' 
        ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        : null,
      accessCount: 0,
      maxAccess: shareType === 'limited' ? 100 : null
    }

    // Mock save to database
    console.log('Share data saved:', shareData)

    return NextResponse.json({
      success: true,
      shareLink,
      shareId,
      shareData
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Failed to create share link: ' + error.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shareId = searchParams.get('shareId')

    if (!shareId) {
      return NextResponse.json({ error: 'Share ID is required' }, { status: 400 })
    }

    // Mock database lookup
    const shareData = {
      shareId,
      projectId: 'project-123',
      shareType: 'public',
      permissions: 'read',
      createdAt: new Date().toISOString(),
      accessCount: 5,
      maxAccess: null
    }

    // Increment access count
    shareData.accessCount += 1

    return NextResponse.json({
      success: true,
      shareData
    })

  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Failed to access shared project: ' + error.message 
    }, { status: 500 })
  }
}

function generateShareId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}