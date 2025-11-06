'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Github, Mail, Eye, EyeOff } from 'lucide-react'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid credentials. Try demo@example.com / password123')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      setError('An error occurred during sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: string) => {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: '/dashboard' })
    } catch (error) {
      setError(`Failed to sign in with ${provider}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription>
            Sign in to your Vibe Code account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="credentials">Email</TabsTrigger>
              <TabsTrigger value="oauth">Quick Access</TabsTrigger>
            </TabsList>
            
            <TabsContent value="credentials" className="space-y-4">
              <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                    {error}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
              
              <div className="text-center">
                <Badge variant="secondary" className="text-xs">
                  Demo: demo@example.com / password123
                </Badge>
              </div>
            </TabsContent>
            
            <TabsContent value="oauth" className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn('github')}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <Github className="h-4 w-4" />
                  <span>Continue with GitHub</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleOAuthSignIn('google')}
                  disabled={isLoading}
                  className="flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Continue with Google</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/auth/signup" className="text-purple-600 hover:underline">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}