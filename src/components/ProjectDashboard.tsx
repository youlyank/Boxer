'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Star, 
  Clock, 
  Users, 
  Code2, 
  FolderOpen, 
  Trash2, 
  Edit,
  Share2,
  Download,
  Eye,
  GitBranch,
  Zap,
  TrendingUp
} from 'lucide-react'
import CodeEditor from '@/components/CodeEditor'

interface Project {
  id: string
  name: string
  description: string
  language: string
  createdAt: string
  updatedAt: string
  stars: number
  forks: number
  isPublic: boolean
  lastActivity: string
  tags: string[]
  code?: string
}

const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'React Dashboard',
    description: 'Modern admin dashboard with React and TypeScript',
    language: 'typescript',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    stars: 42,
    forks: 8,
    isPublic: true,
    lastActivity: '2 hours ago',
    tags: ['react', 'typescript', 'dashboard'],
    code: `// React Dashboard Component
import React, { useState, useEffect } from 'react';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <h1>Welcome {user.name}</h1>
    </div>
  );
};`
  },
  {
    id: '2',
    name: 'Python API Server',
    description: 'RESTful API built with FastAPI and PostgreSQL',
    language: 'python',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    stars: 28,
    forks: 5,
    isPublic: true,
    lastActivity: '1 day ago',
    tags: ['python', 'fastapi', 'api'],
    code: `# FastAPI Application
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Vibe Code API")

class User(BaseModel):
    id: int
    name: str
    email: str

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"user_id": user_id, "name": "John Doe"}

@app.post("/users/")
async def create_user(user: User):
    return {"message": "User created successfully", "user": user}`
  },
  {
    id: '3',
    name: 'CSS Animation Library',
    description: 'Beautiful CSS animations and transitions',
    language: 'css',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-16',
    stars: 156,
    forks: 23,
    isPublic: true,
    lastActivity: '3 hours ago',
    tags: ['css', 'animation', 'ui'],
    code: `/* CSS Animation Library */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.vibe-fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.vibe-hover-lift {
  transition: transform 0.3s ease;
}

.vibe-hover-lift:hover {
  transform: translateY(-5px);
}`
  },
  {
    id: '4',
    name: 'Node.js Microservice',
    description: 'Scalable microservice architecture with Express',
    language: 'javascript',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19',
    stars: 67,
    forks: 12,
    isPublic: false,
    lastActivity: '5 hours ago',
    tags: ['nodejs', 'microservice', 'express'],
    code: `// Microservice Template
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`
  }
]

export default function ProjectDashboard() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    if (activeTab === 'all') return matchesSearch
    if (activeTab === 'public') return matchesSearch && project.isPublic
    if (activeTab === 'private') return matchesSearch && !project.isPublic
    if (activeTab === 'starred') return matchesSearch && project.stars > 50
    
    return matchesSearch
  })

  const stats = {
    totalProjects: projects.length,
    publicProjects: projects.filter(p => p.isPublic).length,
    totalStars: projects.reduce((sum, p) => sum + p.stars, 0),
    totalForks: projects.reduce((sum, p) => sum + p.forks, 0)
  }

  const getLanguageIcon = (language: string) => {
    const icons: Record<string, string> = {
      javascript: '🟨',
      typescript: '🔷',
      python: '🐍',
      css: '🎨',
      html: '🌐',
      json: '📄'
    }
    return icons[language] || '📝'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Project Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your coding projects and collaborate with the community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Public Projects</p>
                  <p className="text-2xl font-bold">{stats.publicProjects}</p>
                </div>
                <Share2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Stars</p>
                  <p className="text-2xl font-bold">{stats.totalStars}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Forks</p>
                  <p className="text-2xl font-bold">{stats.totalForks}</p>
                </div>
                <GitBranch className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={() => setShowNewProjectModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="public">Public</TabsTrigger>
                    <TabsTrigger value="private">Private</TabsTrigger>
                    <TabsTrigger value="starred">Starred</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className={`p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        selectedProject?.id === project.id ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                      }`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getLanguageIcon(project.language)}</span>
                          <h3 className="font-semibold text-sm">{project.name}</h3>
                        </div>
                        {project.isPublic && (
                          <Badge variant="secondary" className="text-xs">Public</Badge>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {project.stars}
                          </span>
                          <span className="flex items-center">
                            <GitBranch className="h-3 w-3 mr-1" />
                            {project.forks}
                          </span>
                        </div>
                        <span>{project.lastActivity}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Project Details / Code Editor */}
          <div className="lg:col-span-2">
            {selectedProject ? (
              <div className="space-y-4">
                {/* Project Header */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{getLanguageIcon(selectedProject.language)}</span>
                          <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                          <Badge variant={selectedProject.isPublic ? 'default' : 'secondary'}>
                            {selectedProject.isPublic ? 'Public' : 'Private'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {selectedProject.description}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        {selectedProject.stars} stars
                      </span>
                      <span className="flex items-center">
                        <GitBranch className="h-4 w-4 mr-1" />
                        {selectedProject.forks} forks
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Updated {formatDate(selectedProject.updatedAt)}
                      </span>
                      <span className="flex items-center">
                        <Zap className="h-4 w-4 mr-1" />
                        {selectedProject.lastActivity}
                      </span>
                    </div>
                  </CardHeader>
                </Card>

                {/* Code Editor */}
                {selectedProject.code && (
                  <CodeEditor
                    initialCode={selectedProject.code}
                    language={selectedProject.language}
                    readOnly={false}
                  />
                )}
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Select a Project
                  </h3>
                  <p className="text-gray-500">
                    Choose a project from the list to view and edit its code
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}