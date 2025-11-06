# 🚀 Vibe Code Platform

A modern, feature-rich coding platform with real-time collaboration, AI-powered assistance, and comprehensive project management capabilities.

## ✨ Features

### 🎯 Core Functionality
- **💻 Advanced Code Editor** - Multi-language support with syntax highlighting
- **🚀 Real-time Collaboration** - Live coding with team members via WebSocket
- **📊 Project Management** - Complete dashboard with statistics and organization
- **📚 Code Templates Library** - 50+ professional templates and snippets
- **🔗 Project Sharing** - Flexible sharing with permissions and export options
- **⚡ Code Execution** - Secure sandbox for running multiple languages

### 🎨 User Experience
- **🌈 Modern UI** - Beautiful gradient-based design with smooth animations
- **📱 Responsive Design** - Mobile-first approach with perfect scaling
- **🌙 Dark/Light Theme** - Built-in theme switching capability
- **♿ Accessibility** - Semantic HTML with ARIA support
- **⚡ Performance** - Optimized loading and interactions

### 🛠 Technical Features
- **🔄 Real-time Sync** - WebSocket-based collaborative editing
- **💾 Export Options** - JSON, Markdown, ZIP, PDF formats
- **🔐 Security** - Safe code execution sandbox
- **📈 Analytics** - Project statistics and usage tracking
- **🎯 Type Safety** - Full TypeScript implementation

## 🏗 Technology Stack

### Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe development
- **🎨 Tailwind CSS 4** - Utility-first styling
- **🧩 shadcn/ui** - High-quality component library

### Real-time & Backend
- **🌐 Socket.IO** - WebSocket for real-time features
- **🔧 API Routes** - Next.js backend endpoints
- **🗄️ File System** - Project storage and management

### UI/UX
- **🎯 Lucide React** - Beautiful icon library
- **📊 Responsive Grid** - Mobile-first layouts
- **🎭 Animations** - Smooth transitions and micro-interactions

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/youlyank/Boxer.git
cd Boxer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API endpoints
│   │   ├── execute/        # Code execution
│   │   ├── share/          # Project sharing
│   │   └── socket/         # WebSocket server
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── CodeEditor.tsx     # Advanced code editor
│   ├── ProjectDashboard.tsx # Project management
│   ├── CollaborativeEditor.tsx # Real-time collaboration
│   ├── CodeTemplatesLibrary.tsx # Templates library
│   └── ProjectShare.tsx   # Sharing & export
├── hooks/                # Custom React hooks
└── lib/                  # Utilities and configurations
```

## 🎯 Main Features

### 1. **Interactive Code Editor**
- Multi-language support (JavaScript, TypeScript, Python, HTML, CSS, JSON)
- Line numbers and syntax highlighting
- Real-time code execution
- Copy, download, and template functionality
- Professional dark theme interface

### 2. **Project Dashboard**
- Project statistics (total projects, stars, forks)
- Filterable project list with search
- Categories (All, Public, Private, Starred)
- Interactive project cards with metadata
- Integrated code editor for each project

### 3. **Real-time Collaboration**
- WebSocket-based collaborative editing
- Live user presence and typing indicators
- Real-time chat functionality
- User color coding and cursor tracking
- Project room management

### 4. **Code Templates Library**
- 50+ pre-built code templates
- Categorized by language and difficulty
- Search and filter functionality
- Grid and list view modes
- One-click template insertion
- Favorites and statistics tracking

### 5. **Project Sharing & Export**
- Multiple share types (Public, Private, Temporary)
- Permission levels (View, Comment, Edit)
- Social media integration
- Export formats (JSON, Markdown, ZIP, PDF)
- Download and share statistics

## 🔧 Development

### Code Quality
- **ESLint** configured for best practices
- **TypeScript** strict mode enabled
- **Prettier** for consistent formatting
- **Git hooks** for pre-commit checks

### Performance
- **Code splitting** for optimal loading
- **Image optimization** with Next.js
- **Bundle analysis** and optimization
- **Caching strategies** implemented

### Security
- **Code execution sandbox** for safe running
- **Input validation** and sanitization
- **CORS configuration** for API endpoints
- **Environment variables** for sensitive data

## 🌟 Highlights

- **🚀 Production Ready** - Optimized for deployment
- **📱 Mobile Responsive** - Works perfectly on all devices
- **♿ Accessible** - WCAG compliant implementation
- **🔒 Secure** - Best security practices followed
- **⚡ Fast** - Optimized performance and loading
- **🎨 Beautiful** - Modern, professional UI design
- **🔧 Extensible** - Easy to add new features

## 📊 API Endpoints

### Code Execution
- `POST /api/execute` - Execute code in various languages

### Project Sharing
- `POST /api/share` - Create share links
- `GET /api/share` - Access shared projects

### Project Export
- `POST /api/export` - Export projects in different formats

### Real-time Communication
- `WS /api/socket` - WebSocket for collaboration

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```bash
# Build image
docker build -t vibe-code-platform .

# Run container
docker run -p 3000:3000 vibe-code-platform
```

### Traditional Hosting
```bash
# Build application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - The React framework
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO** - Real-time communication
- **Lucide** - Amazing icon library

---

Built with ❤️ for the developer community. Experience the future of coding platforms! 🚀