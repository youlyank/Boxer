'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Code2, Play, Save, Share2, Users, Zap, Globe, Rocket, Sparkles, Terminal, GitBranch, Lightbulb, FolderOpen, Star, Download, Eye } from 'lucide-react'
import Link from 'next/link'
import CodeEditor from '@/components/CodeEditor'
import ProjectDashboard from '@/components/ProjectDashboard'
import CodeTemplatesLibrary from '@/components/CodeTemplatesLibrary'
import ProjectShare from '@/components/ProjectShare'
import CollaborativeEditor from '@/components/CollaborativeEditor'

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')
  const [code, setCode] = useState(`// Welcome to Vibe Code Platform
// Start coding with a vibe! ✨

function greetVibe() {
  const vibes = ['awesome', 'creative', 'innovative', 'epic'];
  const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
  console.log(\`You are \${randomVibe}!\`);
}

greetVibe();`);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running your code...');
    
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: 'javascript' })
      });
      
      const result = await response.json();
      setOutput(result.output || result.error);
    } catch (error) {
      setOutput('Error: Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const sampleProject = {
    id: 'demo-project',
    name: 'Demo Project',
    language: 'javascript',
    code: code,
    isPublic: true
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Vibe Code
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab('home')}
                className={activeTab === 'home' ? 'text-purple-600' : ''}
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab('dashboard')}
                className={activeTab === 'dashboard' ? 'text-purple-600' : ''}
              >
                Dashboard
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab('templates')}
                className={activeTab === 'templates' ? 'text-purple-600' : ''}
              >
                Templates
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab('collaborate')}
                className={activeTab === 'collaborate' ? 'text-purple-600' : ''}
              >
                Collaborate
              </Button>
              <Button variant="outline">Sign In</Button>
              <Button>Get Started</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <section className="py-20 px-4">
              <div className="container mx-auto text-center">
                <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered Coding Platform
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Code with Vibe
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                  Experience the future of coding with our vibrant platform. Build, collaborate, and deploy with AI assistance and real-time collaboration.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Start Coding Now
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => setActiveTab('templates')}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Browse Templates
                  </Button>
                </div>
              </div>
            </section>

            {/* Interactive Editor Section */}
            <section className="py-16 px-4">
              <div className="container mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Try It Yourself</h2>
                  <p className="text-gray-600 dark:text-gray-300">Experience our interactive code editor with real-time execution</p>
                </div>

                <Card className="max-w-6xl mx-auto">
                  <CardHeader>
                    <Tabs value="editor" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="editor">Editor</TabsTrigger>
                        <TabsTrigger value="output">Output</TabsTrigger>
                        <TabsTrigger value="templates">Quick Templates</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  <CardContent>
                    <Tabs value="editor" className="w-full">
                      <TabsContent value="editor" className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">JavaScript</Badge>
                            <span className="text-sm text-gray-500">Live Editor</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Save className="w-4 h-4 mr-1" />
                              Save
                            </Button>
                            <Button size="sm" onClick={handleRunCode} disabled={isRunning}>
                              <Play className="w-4 h-4 mr-1" />
                              {isRunning ? 'Running...' : 'Run'}
                            </Button>
                          </div>
                        </div>
                        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                          <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-64 bg-transparent outline-none resize-none"
                            spellCheck={false}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="output" className="space-y-4">
                        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-auto">
                          <div className="mb-2 text-gray-500">$ Output:</div>
                          <pre>{output || 'Run your code to see the output here...'}</pre>
                        </div>
                      </TabsContent>

                      <TabsContent value="templates" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            { title: 'Hello World', icon: '👋', description: 'Classic starter template' },
                            { title: 'React Component', icon: '⚛️', description: 'Modern React component' },
                            { title: 'API Server', icon: '🚀', description: 'Express.js server setup' },
                            { title: 'Data Structures', icon: '📊', description: 'Common algorithms' },
                            { title: 'Game Loop', icon: '🎮', description: 'Simple game framework' },
                            { title: 'Machine Learning', icon: '🤖', description: 'ML model template' }
                          ].map((template, index) => (
                            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                              <CardContent className="p-4">
                                <div className="text-2xl mb-2">{template.icon}</div>
                                <h3 className="font-semibold mb-1">{template.title}</h3>
                                <p className="text-sm text-gray-600">{template.description}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 bg-white/50 dark:bg-gray-900/50">
              <div className="container mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Why Choose Vibe Code?</h2>
                  <p className="text-gray-600 dark:text-gray-300">Everything you need to code with style and efficiency</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Zap className="h-8 w-8 text-yellow-500 mb-2" />
                      <CardTitle>Lightning Fast</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Instant code execution with optimized performance and real-time collaboration.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Users className="h-8 w-8 text-blue-500 mb-2" />
                      <CardTitle>Real-time Collaboration</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Code together with your team in real-time, share ideas instantly.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Terminal className="h-8 w-8 text-green-500 mb-2" />
                      <CardTitle>Multi-language Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Support for 50+ programming languages with intelligent syntax highlighting.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <GitBranch className="h-8 w-8 text-purple-500 mb-2" />
                      <CardTitle>Version Control</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Built-in Git integration for seamless version control and collaboration.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Lightbulb className="h-8 w-8 text-orange-500 mb-2" />
                      <CardTitle>AI Assistant</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Get intelligent code suggestions, debugging help, and optimization tips.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Globe className="h-8 w-8 text-cyan-500 mb-2" />
                      <CardTitle>Deploy Anywhere</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        One-click deployment to multiple platforms with zero configuration.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
              <div className="container mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4">Ready to Code with Vibe?</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                  Join thousands of developers who are already coding with style
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Your Coding Journey
                </Button>
              </div>
            </section>
          </>
        )}

        {activeTab === 'dashboard' && (
          <div className="py-8">
            <ProjectDashboard />
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="py-8">
            <CodeTemplatesLibrary />
          </div>
        )}

        {activeTab === 'collaborate' && (
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Collaborative Coding
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Code together in real-time with your team
                </p>
              </div>
              <CollaborativeEditor
                projectId="demo-collab"
                username="Demo User"
                initialCode={code}
                language="javascript"
                onCodeChange={setCode}
              />
            </div>
          </div>
        )}

        {activeTab === 'share' && (
          <div className="py-8">
            <ProjectShare
              projectId={sampleProject.id}
              projectName={sampleProject.name}
              projectLanguage={sampleProject.language}
              projectCode={sampleProject.code}
              isPublic={sampleProject.isPublic}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Code2 className="h-6 w-6 text-purple-600" />
              <span className="text-lg font-semibold">Vibe Code</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <span>© 2024 Vibe Code Platform</span>
              <span>•</span>
              <span>Made with ❤️ by developers</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}