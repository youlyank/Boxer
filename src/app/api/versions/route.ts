import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { projectId, code, message, authorId } = await request.json()

    if (!projectId || !code || !authorId) {
      return NextResponse.json({ 
        error: 'Project ID, code, and author ID are required' 
      }, { status: 400 })
    }

    // Get the latest version number
    const latestVersion = await db.projectVersion.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    })

    // Generate new version number
    let newVersion = '1.0.0'
    if (latestVersion) {
      const parts = latestVersion.version.split('.').map(Number)
      parts[2]++ // Increment patch version
      newVersion = parts.join('.')
    }

    // Create new version
    const newProjectVersion = await db.projectVersion.create({
      data: {
        projectId,
        version: newVersion,
        code,
        message: message || `Version ${newVersion}`,
        authorId
      }
    })

    // Update project with new code
    await db.project.update({
      where: { id: projectId },
      data: { 
        code,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        version: newProjectVersion,
        message: `Version ${newVersion} created successfully`
      }
    })

  } catch (error: any) {
    console.error('Version Creation Error:', error)
    return NextResponse.json({ 
      error: 'Failed to create version',
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ 
        error: 'Project ID is required' 
      }, { status: 400 })
    }

    // Get all versions for the project
    const versions = await db.projectVersion.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
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
        versions,
        totalVersions: versions.length
      }
    })

  } catch (error: any) {
    console.error('Version Fetch Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch versions',
      details: error.message 
    }, { status: 500 })
  }
}