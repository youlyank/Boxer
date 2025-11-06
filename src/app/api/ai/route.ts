import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { type, input, language, userId, projectId } = await request.json()

    if (!type || !input) {
      return NextResponse.json({ error: 'Type and input are required' }, { status: 400 })
    }

    // Record AI request start
    const startTime = Date.now()
    let aiRequest
    
    if (userId) {
      aiRequest = await db.aIRequest.create({
        data: {
          userId,
          type,
          input,
          success: false
        }
      })
    }

    const zai = await ZAI.create()
    let response
    let tokens = 0

    try {
      switch (type) {
        case 'completion':
          response = await zai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are an expert ${language} programmer. Provide intelligent code completion suggestions. Be concise and accurate.`
              },
              {
                role: 'user',
                content: `Complete this ${language} code:\n\n${input}\n\nProvide only the completed code without explanation.`
              }
            ],
            max_tokens: 500,
            temperature: 0.3
          })
          tokens = response.usage?.total_tokens || 0
          break

        case 'debug':
          response = await zai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are an expert debugging assistant for ${language}. Analyze the code and provide solutions.`
              },
              {
                role: 'user',
                content: `Debug this ${language} code and fix any issues:\n\n${input}\n\nExplain the issues and provide corrected code.`
              }
            ],
            max_tokens: 800,
            temperature: 0.2
          })
          tokens = response.usage?.total_tokens || 0
          break

        case 'optimization':
          response = await zai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are an expert in ${language} code optimization. Improve performance, readability, and best practices.`
              },
              {
                role: 'user',
                content: `Optimize this ${language} code:\n\n${input}\n\nProvide the optimized version with explanations.`
              }
            ],
            max_tokens: 1000,
            temperature: 0.1
          })
          tokens = response.usage?.total_tokens || 0
          break

        case 'generation':
          response = await zai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are an expert ${language} programmer. Generate code based on requirements.`
              },
              {
                role: 'user',
                content: `Generate ${language} code for: ${input}\n\nProvide complete, working code with explanations.`
              }
            ],
            max_tokens: 1500,
            temperature: 0.4
          })
          tokens = response.usage?.total_tokens || 0
          break

        case 'refactoring':
          response = await zai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are an expert in ${language} code refactoring. Improve structure, maintainability, and follow best practices.`
              },
              {
                role: 'user',
                content: `Refactor this ${language} code:\n\n${input}\n\nProvide the refactored version with explanations.`
              }
            ],
            max_tokens: 1200,
            temperature: 0.2
          })
          tokens = response.usage?.total_tokens || 0
          break

        default:
          return NextResponse.json({ error: 'Invalid AI request type' }, { status: 400 })
      }
    } catch (error: any) {
      console.error('AI Service Error:', error)
      
      // Update request with failure
      if (aiRequest) {
        await db.aIRequest.update({
          where: { id: aiRequest.id },
          data: { success: false }
        })
      }
      
      return NextResponse.json({ 
        error: 'AI service temporarily unavailable',
        details: error.message 
      }, { status: 500 })
    }

    const endTime = Date.now()
    const latency = endTime - startTime

    // Update request with success
    if (aiRequest) {
      await db.aIRequest.update({
        where: { id: aiRequest.id },
        data: {
          output: response.choices[0]?.message?.content || '',
          tokens,
          latency,
          success: true
        }
      })
    }

    // Save AI suggestion if it's for a project
    if (projectId && response.choices[0]?.message?.content) {
      await db.aISuggestion.create({
        data: {
          projectId,
          type,
          suggestion: response.choices[0].message.content,
          confidence: 0.85 // Mock confidence score
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        content: response.choices[0]?.message?.content || '',
        tokens,
        latency,
        type
      }
    })

  } catch (error: any) {
    console.error('AI API Error:', error)
    return NextResponse.json({ 
      error: 'Failed to process AI request',
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get user's AI request history
    const requests = await db.aIRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // Get statistics
    const stats = await db.aIRequest.groupBy({
      by: ['type'],
      where: { userId },
      _count: true,
      _sum: {
        tokens: true,
        latency: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        requests,
        stats,
        totalRequests: requests.length,
        totalTokens: requests.reduce((sum, req) => sum + (req.tokens || 0), 0)
      }
    })

  } catch (error: any) {
    console.error('AI History Error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch AI history',
      details: error.message 
    }, { status: 500 })
  }
}