'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Share2, 
  Download, 
  Link, 
  Copy, 
  Mail, 
  MessageSquare, 
  FileText, 
  Archive, 
  Code, 
  Image,
  Globe,
  Lock,
  Users,
  Eye,
  Calendar,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Edit
} from 'lucide-react'

interface ProjectShareProps {
  projectId: string
  projectName: string
  projectLanguage: string
  projectCode: string
  isPublic: boolean
}

export default function ProjectShare({
  projectId,
  projectName,
  projectLanguage,
  projectCode,
  isPublic
}: ProjectShareProps) {
  const [shareLink, setShareLink] = useState('')
  const [shareType, setShareType] = useState<'public' | 'private' | 'temporary'>('public')
  const [permissions, setPermissions] = useState<'view' | 'comment' | 'edit'>('view')
  const [exportFormat, setExportFormat] = useState<'json' | 'markdown' | 'zip' | 'pdf'>('json')
  const [isCreatingShare, setIsCreatingShare] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleCreateShareLink = async () => {
    setIsCreatingShare(true)
    setShareSuccess(false)

    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          shareType,
          permissions
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setShareLink(result.shareLink)
        setShareSuccess(true)
      } else {
        console.error('Failed to create share link:', result.error)
      }
    } catch (error) {
      console.error('Error creating share link:', error)
    } finally {
      setIsCreatingShare(false)
    }
  }

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleExportProject = async () => {
    setIsExporting(true)
    setExportSuccess(false)

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          format: exportFormat,
          code: projectCode,
          projectName,
          language: projectLanguage
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Create download link
        const blob = new Blob([JSON.stringify(result.exportData, null, 2)], {
          type: result.mimeType
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        setExportSuccess(true)
      } else {
        console.error('Failed to export project:', result.error)
      }
    } catch (error) {
      console.error('Error exporting project:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out my project: ${projectName}`)
    const body = encodeURIComponent(`I wanted to share my ${projectLanguage} project "${projectName}" with you.\n\nYou can view it here: ${shareLink || '[Create a share link first]'}\n\nCreated with Vibe Code Platform`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const handleSocialShare = (platform: string) => {
    const text = encodeURIComponent(`Check out my ${projectLanguage} project "${projectName}" on Vibe Code!`)
    const url = encodeURIComponent(shareLink || window.location.href)
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      reddit: `https://reddit.com/submit?url=${url}&title=${text}`
    }
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank')
    }
  }

  const getShareTypeIcon = (type: string) => {
    const icons = {
      public: <Globe className="h-4 w-4" />,
      private: <Lock className="h-4 w-4" />,
      temporary: <Calendar className="h-4 w-4" />
    }
    return icons[type as keyof typeof icons] || <Share2 className="h-4 w-4" />
  }

  const getExportFormatIcon = (format: string) => {
    const icons = {
      json: <Code className="h-4 w-4" />,
      markdown: <FileText className="h-4 w-4" />,
      zip: <Archive className="h-4 w-4" />,
      pdf: <FileText className="h-4 w-4" />
    }
    return icons[format as keyof typeof icons] || <Download className="h-4 w-4" />
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Share & Export Project
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Share your {projectName} project with others or export it for use elsewhere
        </p>
      </div>

      <Tabs defaultValue="share" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="share" className="flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Share Project</span>
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Project</span>
          </TabsTrigger>
        </TabsList>

        {/* Share Tab */}
        <TabsContent value="share" className="space-y-6">
          {/* Share Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Share2 className="h-5 w-5" />
                <span>Share Settings</span>
              </CardTitle>
              <CardDescription>
                Configure how your project can be shared and accessed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shareType">Share Type</Label>
                  <Select value={shareType} onValueChange={(value: any) => setShareType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <span>Public - Anyone with link can view</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center space-x-2">
                          <Lock className="h-4 w-4" />
                          <span>Private - Only specific users</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="temporary">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Temporary - Expires in 24 hours</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permissions">Permissions</Label>
                  <Select value={permissions} onValueChange={(value: any) => setPermissions(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4" />
                          <span>View only</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="comment">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4" />
                          <span>View and comment</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="edit">
                        <div className="flex items-center space-x-2">
                          <Edit className="h-4 w-4" />
                          <span>View, comment, and edit</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleCreateShareLink}
                disabled={isCreatingShare}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isCreatingShare ? 'Creating...' : 'Create Share Link'}
              </Button>

              {shareSuccess && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Share link created successfully!</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Share Link */}
          {shareLink && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Link className="h-5 w-5" />
                  <span>Share Link</span>
                </CardTitle>
                <CardDescription>
                  Your project is now ready to share
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input 
                    value={shareLink} 
                    readOnly 
                    className="flex-1 font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleCopyShareLink}
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(shareLink, '_blank')}
                    className="shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleEmailShare}
                    className="flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleSocialShare('twitter')}
                    className="flex items-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Twitter</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleSocialShare('linkedin')}
                    className="flex items-center space-x-2"
                  >
                    <Users className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => handleSocialShare('facebook')}
                    className="flex items-center space-x-2"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Facebook</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Share Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Share Statistics</CardTitle>
              <CardDescription>
                Track how your project is being accessed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-600">Unique Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-gray-600">Downloads</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Export Project</span>
              </CardTitle>
              <CardDescription>
                Download your project in various formats for offline use or import into other tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exportFormat">Export Format</Label>
                <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">
                      <div className="flex items-center space-x-2">
                        <Code className="h-4 w-4" />
                        <span>JSON - Complete project data</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="markdown">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>Markdown - Documentation format</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="zip">
                      <div className="flex items-center space-x-2">
                        <Archive className="h-4 w-4" />
                        <span>ZIP - Complete project bundle</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="pdf">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span>PDF - Printable document</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Project Information</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Name:</strong> {projectName}</div>
                  <div><strong>Language:</strong> {projectLanguage}</div>
                  <div><strong>Lines of Code:</strong> {projectCode.split('\n').length}</div>
                  <div><strong>File Size:</strong> {((projectCode.length) / 1024).toFixed(2)} KB</div>
                </div>
              </div>

              <Button 
                onClick={handleExportProject}
                disabled={isExporting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isExporting ? 'Exporting...' : 'Export Project'}
              </Button>

              {exportSuccess && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Project exported successfully!</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    navigator.clipboard.writeText(projectCode)
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code to Clipboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    const blob = new Blob([projectCode], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.${projectLanguage === 'typescript' ? 'ts' : projectLanguage === 'javascript' ? 'js' : projectLanguage}`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download as {projectLanguage.toUpperCase()}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Advanced Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Archive className="h-4 w-4 mr-2" />
                  Export with Dependencies
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Image className="h-4 w-4 mr-2" alt="Export as screenshot" />
                  Export as Screenshot
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Users className="h-4 w-4 mr-2" />
                  Export Collaboration History
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}