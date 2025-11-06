'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Play, 
  Save, 
  Copy, 
  Download, 
  Settings, 
  Terminal, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Zap,
  Bug,
  RefreshCw,
  Code,
  Lightbulb
} from 'lucide-react'

interface EnhancedCodeEditorProps {
  initialCode?: string
  language?: string
  onCodeChange?: (code: string) => void
  onRun?: (code: string, language: string) => void
  readOnly?: boolean
  userId?: string
  projectId?: string
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'html', label: 'HTML', icon: '🌐' },
  { value: 'css', label: 'CSS', icon: '🎨' },
  { value: 'json', label: 'JSON', icon: '📄' }
]

const CODE_TEMPLATES: Record<string, string> = {
  javascript: `// JavaScript Template
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log('Fibonacci of 10:', fibonacci(10));`,
  
  typescript: `// TypeScript Template
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(id: number, name: string, email: string): User {
  return { id, name, email };
}

const user = createUser(1, 'John Doe', 'john@example.com');
console.log('User created:', user);`,
  
  python: `# Python Template
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)

print("Sorted array:", quicksort([3, 6, 8, 10, 1, 2, 1]))`,
  
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vibe Code App</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .hero { text-align: center; padding: 60px 0; }
        .btn { 
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
            color: white; padding: 12px 24px; border: none; 
            border-radius: 8px; cursor: pointer; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>Welcome to Vibe Code</h1>
            <p>Build amazing things with code</p>
            <button class="btn" onclick="showMessage()">Click Me!</button>
        </div>
    </div>
    <script>
        function showMessage() {
            alert('Hello from Vibe Code! 🚀');
        }
    </script>
</body>
</html>`,
  
  css: `/* CSS Template */
.vibe-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.vibe-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transform: translateY(0);
  transition: all 0.3s ease;
}

.vibe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.vibe-title {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}`,
  
  json: `{
  "name": "vibe-code-project",
  "version": "1.0.0",
  "description": "A vibrant coding platform",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest"
  },
  "keywords": ["coding", "vibe", "platform"],
  "author": "Vibe Developer",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.0",
    "socket.io": "^4.7.0"
  },
  "features": {
    "realTime": true,
    "collaboration": true,
    "aiAssistance": true
  }
}`
}

export default function EnhancedCodeEditor({ 
  initialCode = CODE_TEMPLATES.javascript,
  language = 'javascript',
  onCodeChange,
  onRun,
  readOnly = false,
  userId,
  projectId
}: EnhancedCodeEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isAILoading, setIsAILoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [executionStatus, setExecutionStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setCode(initialCode)
  }, [initialCode])

  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code)
    }
  }, [code, onCodeChange])

  const handleRunCode = async () => {
    setIsRunning(true)
    setExecutionStatus('running')
    setOutput('Running your code...')

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: selectedLanguage })
      })

      const result = await response.json()
      
      if (result.error) {
        setOutput(`❌ Error: ${result.error}`)
        setExecutionStatus('error')
      } else {
        setOutput(`✅ Output:\n${result.output}`)
        setExecutionStatus('success')
      }
    } catch (error) {
      setOutput(`❌ Network Error: Failed to execute code`)
      setExecutionStatus('error')
    } finally {
      setIsRunning(false)
    }
  }

  const handleAIGenerate = async (type: 'completion' | 'debug' | 'optimization' | 'generation' | 'refactoring') => {
    if (!userId || !code.trim()) return

    setIsAILoading(true)
    setAiSuggestion('')

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          input: code,
          language: selectedLanguage,
          userId,
          projectId
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setAiSuggestion(result.data.content)
      } else {
        console.error('AI Error:', result.error)
      }
    } catch (error) {
      console.error('AI Request Error:', error)
    } finally {
      setIsAILoading(false)
    }
  }

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage)
    setCode(CODE_TEMPLATES[newLanguage] || '')
    setOutput('')
    setExecutionStatus('idle')
    setAiSuggestion('')
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const handleDownloadCode = () => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      html: 'html',
      css: 'css',
      json: 'json'
    }
    
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vibe-code.${extensions[selectedLanguage] || 'txt'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const applyAISuggestion = () => {
    if (aiSuggestion) {
      setCode(aiSuggestion)
      setAiSuggestion('')
    }
  }

  const getLineNumbers = () => {
    const lines = code.split('\n')
    return lines.map((_, index) => index + 1).join('\n')
  }

  const currentLang = LANGUAGES.find(lang => lang.value === selectedLanguage)

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CardTitle className="flex items-center space-x-2">
              <span className="text-2xl">{currentLang?.icon}</span>
              <span>AI-Powered Code Editor</span>
            </CardTitle>
            <Badge variant="secondary">{currentLang?.label}</Badge>
            {executionStatus === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
            {executionStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    <span className="flex items-center space-x-2">
                      <span>{lang.icon}</span>
                      <span>{lang.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button size="sm" variant="outline" onClick={handleCopyCode}>
              <Copy className="w-4 h-4" />
            </Button>
            
            <Button size="sm" variant="outline" onClick={handleDownloadCode}>
              <Download className="w-4 h-4" />
            </Button>
            
            <Button 
              size="sm" 
              onClick={handleRunCode} 
              disabled={isRunning || readOnly}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Play className="w-4 h-4 mr-1" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="space-y-4">
            <div className="relative">
              <div className="flex">
                {/* Line numbers */}
                <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 p-4 text-right select-none font-mono text-sm border-r">
                  <pre>{getLineNumbers()}</pre>
                </div>
                
                {/* Code editor */}
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    readOnly={readOnly}
                    className="w-full h-96 p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none outline-none"
                    style={{ 
                      tabSize: 2,
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace'
                    }}
                    spellCheck={false}
                    placeholder="Start typing your code here..."
                  />
                  
                  {/* AI Suggestion Overlay */}
                  {aiSuggestion && (
                    <div className="absolute top-4 left-4 right-4 bg-purple-900/95 text-purple-100 p-3 rounded-lg font-mono text-sm border border-purple-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-sm font-semibold">AI Suggestion</span>
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setAiSuggestion('')}>
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                          <Button size="sm" onClick={applyAISuggestion}>
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <pre className="whitespace-pre-wrap">{aiSuggestion}</pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => handleAIGenerate('completion')}
                disabled={isAILoading || !userId}
                className="flex flex-col items-center space-y-2 h-20"
              >
                <Code className="w-6 h-6" />
                <span>Complete Code</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleAIGenerate('debug')}
                disabled={isAILoading || !userId}
                className="flex flex-col items-center space-y-2 h-20"
              >
                <Bug className="w-6 h-6" />
                <span>Debug Issues</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleAIGenerate('optimization')}
                disabled={isAILoading || !userId}
                className="flex flex-col items-center space-y-2 h-20"
              >
                <Zap className="w-6 h-6" />
                <span>Optimize</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleAIGenerate('generation')}
                disabled={isAILoading || !userId}
                className="flex flex-col items-center space-y-2 h-20"
              >
                <Lightbulb className="w-6 h-6" />
                <span>Generate Code</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleAIGenerate('refactoring')}
                disabled={isAILoading || !userId}
                className="flex flex-col items-center space-y-2 h-20"
              >
                <RefreshCw className="w-6 h-6" />
                <span>Refactor</span>
              </Button>
            </div>
            
            {isAILoading && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span>AI is thinking...</span>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="output" className="space-y-4">
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-auto">
              <div className="mb-2 text-gray-500">$ Output Console</div>
              <pre className="whitespace-pre-wrap">{output || 'Run your code to see the output here...'}</pre>
            </div>
          </TabsContent>
          
          <TabsContent value="suggestions" className="space-y-4">
            <div className="text-center py-8">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-semibold mb-2">AI-Powered Suggestions</h3>
              <p className="text-gray-600 mb-4">
                Get intelligent code suggestions, debugging help, and optimization tips from our AI assistant.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <Card className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Auto-Completion
                  </h4>
                  <p className="text-sm text-gray-600">
                    Get context-aware code completions as you type
                  </p>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    Error Detection
                  </h4>
                  <p className="text-sm text-gray-600">
                    Automatically detect and suggest fixes for bugs
                  </p>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Performance Tips
                  </h4>
                  <p className="text-sm text-gray-600">
                    Get optimization suggestions for better performance
                  </p>
                </Card>
                
                <Card className="p-4">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Best Practices
                  </h4>
                  <p className="text-sm text-gray-600">
                    Learn industry standards and coding conventions
                  </p>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}