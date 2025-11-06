import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { projectId, platform, config, userId } = await request.json()

    if (!projectId || !platform || !userId) {
      return NextResponse.json({ 
        error: 'Project ID, platform, and user ID are required' 
      }, { status: 400 })
    }

    // Verify user has permission to deploy
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { author: true }
    })

    if (!project || project.authorId !== userId) {
      return NextResponse.json({ 
        error: 'Project not found or permission denied' 
      }, { status: 403 })
    }

    // Create deployment record
    const deployment = await db.deployment.create({
      data: {
        projectId,
        platform,
        status: 'pending'
      }
    })

    let deploymentUrl = ''
    let deploymentStatus = 'pending'

    try {
      switch (platform) {
        case 'vercel':
          deploymentUrl = await deployToVercel(project, config)
          deploymentStatus = 'success'
          break
          
        case 'netlify':
          deploymentUrl = await deployToNetlify(project, config)
          deploymentStatus = 'success'
          break
          
        case 'github-pages':
          deploymentUrl = await deployToGitHubPages(project, config)
          deploymentStatus = 'success'
          break
          
        case 'aws-s3':
          deploymentUrl = await deployToAWSS3(project, config)
          deploymentStatus = 'success'
          break
          
        case 'railway':
          deploymentUrl = await deployToRailway(project, config)
          deploymentStatus = 'success'
          break
          
        default:
          deploymentStatus = 'failed'
          throw new Error(`Unsupported platform: ${platform}`)
      }
    } catch (error: any) {
      console.error('Deployment Error:', error)
      deploymentStatus = 'failed'
    }

    // Update deployment record
    await db.deployment.update({
      where: { id: deployment.id },
      data: {
        url: deploymentUrl,
        status: deploymentStatus,
        deployedAt: deploymentStatus === 'success' ? new Date() : null
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        deployment,
        deploymentUrl,
        status: deploymentStatus,
        message: deploymentStatus === 'success' 
          ? `Successfully deployed to ${platform}` 
          : `Failed to deploy to ${platform}`
      }
    })

  } catch (error: any) {
    console.error('Deployment API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to deploy project',
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

    // Get deployment history for the project
    const deployments = await db.deployment.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json({
      success: true,
      data: {
        deployments,
        totalDeployments: deployments.length
      }
    })

  } catch (error: any) {
    console.error('Deployment History Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch deployment history',
      details: error.message 
    }, { status: 500 })
  }
}

// Mock deployment functions
async function deployToVercel(project: any, config: any) {
  // In a real implementation, this would use Vercel API
  console.log('Deploying to Vercel...', project.name)
  
  // Mock deployment URL
  return `https://${project.name.toLowerCase().replace(/\s+/g, '-')}.vercel.app`
}

async function deployToNetlify(project: any, config: any) {
  // In a real implementation, this would use Netlify API
  console.log('Deploying to Netlify...', project.name)
  
  // Mock deployment URL
  return `https://${project.name.toLowerCase().replace(/\s+/g, '-')}.netlify.app`
}

async function deployToGitHubPages(project: any, config: any) {
  // In a real implementation, this would use GitHub API
  console.log('Deploying to GitHub Pages...', project.name)
  
  // Mock deployment URL
  return `https://${config.githubUsername}.github.io/${project.name}`
}

async function deployToAWSS3(project: any, config: any) {
  // In a real implementation, this would use AWS SDK
  console.log('Deploying to AWS S3...', project.name)
  
  // Mock deployment URL
  return `https://${config.bucketName}.s3.amazonaws.com/${project.name}`
}

async function deployToRailway(project: any, config: any) {
  // In a real implementation, this would use Railway API
  console.log('Deploying to Railway...', project.name)
  
  // Mock deployment URL
  return `https://${project.name.toLowerCase().replace(/\s+/g, '-')}.up.railway.app`
}