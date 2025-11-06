'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  User, 
  Mail, 
  Globe, 
  Github, 
  Twitter, 
  Linkedin, 
  Settings, 
  Save,
  Camera,
  MapPin,
  ExternalLink,
  Star,
  Code,
  Zap,
  Shield
} from 'lucide-react'

export default function Profile() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    twitter: '',
    linkedin: '',
    avatar: ''
  })
  
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'javascript',
    autoSave: true,
    lineNumbers: true,
    fontSize: '14',
    fontFamily: 'monaco',
    notifications: {
      email: true,
      browser: true,
      collaborations: true
    }
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })

      const result = await response.json()
      
      if (result.success) {
        setMessage('Profile updated successfully!')
      } else {
        setMessage('Failed to update profile')
      }
    } catch (error) {
      setMessage('An error occurred while updating profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      const result = await response.json()
      
      if (result.success) {
        setMessage('Settings updated successfully!')
      } else {
        setMessage('Failed to update settings')
      }
    } catch (error) {
      setMessage('An error occurred while updating settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        setProfile(prev => ({ ...prev, avatar: result.data.avatarUrl }))
        setMessage('Avatar updated successfully!')
      } else {
        setMessage('Failed to upload avatar')
      }
    } catch (error) {
      setMessage('An error occurred while uploading avatar')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Profile & Settings
          </h1>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl">
                      {session.user?.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{session.user?.name || 'User'}</h3>
                    <p className="text-sm text-gray-600">@{session.user?.username || 'username'}</p>
                    <Badge variant="secondary" className="mt-2">
                      {session.user?.isPremium ? 'Premium' : 'Free'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{session.user?.email}</span>
                  </div>
                  {session.user?.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{session.user.location}</span>
                    </div>
                  )}
                  {session.user?.website && (
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <a 
                        href={session.user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {session.user.website}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Settings */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Display Name</Label>
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={profile.username}
                            onChange={(e) => setProfile(prev => ({ ...prev, username: e.target.value }))}
                            placeholder="Enter your username"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                          placeholder="Tell us about yourself"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={profile.location}
                            onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="City, Country"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profile.website}
                            onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub</Label>
                          <Input
                            id="github"
                            value={profile.github}
                            onChange={(e) => setProfile(prev => ({ ...prev, github: e.target.value }))}
                            placeholder="username"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter</Label>
                          <Input
                            id="twitter"
                            value={profile.twitter}
                            onChange={(e) => setProfile(prev => ({ ...prev, twitter: e.target.value }))}
                            placeholder="@username"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn</Label>
                          <Input
                            id="linkedin"
                            value={profile.linkedin}
                            onChange={(e) => setProfile(prev => ({ ...prev, linkedin: e.target.value }))}
                            placeholder="profile URL"
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Editor Settings</CardTitle>
                    <CardDescription>
                      Customize your coding experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSettingsUpdate} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="theme">Theme</Label>
                          <Select value={settings.theme} onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="auto">Auto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="language">Default Language</Label>
                          <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="javascript">JavaScript</SelectItem>
                              <SelectItem value="typescript">TypeScript</SelectItem>
                              <SelectItem value="python">Python</SelectItem>
                              <SelectItem value="html">HTML</SelectItem>
                              <SelectItem value="css">CSS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fontSize">Font Size</Label>
                          <Select value={settings.fontSize} onValueChange={(value) => setSettings(prev => ({ ...prev, fontSize: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12">12px</SelectItem>
                              <SelectItem value="14">14px</SelectItem>
                              <SelectItem value="16">16px</SelectItem>
                              <SelectItem value="18">18px</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fontFamily">Font Family</Label>
                          <Select value={settings.fontFamily} onValueChange={(value) => setSettings(prev => ({ ...prev, fontFamily: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monaco">Monaco</SelectItem>
                              <SelectItem value="fira">Fira Code</SelectItem>
                              <SelectItem value="jetbrains">JetBrains Mono</SelectItem>
                              <SelectItem value="source">Source Code Pro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="autoSave"
                            checked={settings.autoSave}
                            onChange={(e) => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))}
                            className="rounded"
                          />
                          <Label htmlFor="autoSave">Auto-save code</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="lineNumbers"
                            checked={settings.lineNumbers}
                            onChange={(e) => setSettings(prev => ({ ...prev, lineNumbers: e.target.checked }))}
                            className="rounded"
                          />
                          <Label htmlFor="lineNumbers">Show line numbers</Label>
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Settings'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Security</span>
                    </CardTitle>
                    <CardDescription>
                      Manage your account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold mb-2">Change Password</h4>
                        <div className="space-y-2">
                          <Input type="password" placeholder="Current password" />
                          <Input type="password" placeholder="New password" />
                          <Input type="password" placeholder="Confirm new password" />
                          <Button variant="outline" className="w-full">
                            Update Password
                          </Button>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="font-semibold mb-2">Two-Factor Authentication</h4>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600">Status: Not enabled</p>
                            <p className="text-xs text-gray-500">Add an extra layer of security</p>
                          </div>
                          <Button variant="outline">
                            Enable 2FA
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}