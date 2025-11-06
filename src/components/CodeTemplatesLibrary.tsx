'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, 
  Copy, 
  Download, 
  Star, 
  Clock, 
  Code2, 
  Filter,
  Grid,
  List,
  Heart,
  Share2,
  Eye
} from 'lucide-react'

interface CodeTemplate {
  id: string
  name: string
  description: string
  category: string
  language: string
  code: string
  author: string
  stars: number
  views: number
  createdAt: string
  tags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  isFavorite: boolean
}

const CODE_TEMPLATES: CodeTemplate[] = [
  {
    id: '1',
    name: 'React Hook Component',
    description: 'Modern React component with custom hooks and TypeScript',
    category: 'React',
    language: 'typescript',
    code: `import React, { useState, useEffect, useCallback } from 'react';

interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useCounter = (initialValue: number = 0): UseCounterReturn => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount(prev => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  return { count, increment, decrement, reset };
};

const CounterComponent: React.FC = () => {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Counter: {count}</h2>
      <div className="space-x-2">
        <button onClick={increment} className="px-4 py-2 bg-blue-500 text-white rounded">
          Increment
        </button>
        <button onClick={decrement} className="px-4 py-2 bg-red-500 text-white rounded">
          Decrement
        </button>
        <button onClick={reset} className="px-4 py-2 bg-gray-500 text-white rounded">
          Reset
        </button>
      </div>
    </div>
  );
};

export default CounterComponent;`,
    author: 'React Dev',
    stars: 245,
    views: 1520,
    createdAt: '2024-01-15',
    tags: ['react', 'hooks', 'typescript', 'component'],
    difficulty: 'intermediate',
    isFavorite: false
  },
  {
    id: '2',
    name: 'Express REST API',
    description: 'Complete REST API with Express.js, authentication, and database',
    category: 'Backend',
    language: 'javascript',
    code: `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Validate user (replace with actual authentication)
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    // Fetch users from database
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
    author: 'Backend Master',
    stars: 189,
    views: 980,
    createdAt: '2024-01-10',
    tags: ['express', 'api', 'authentication', 'jwt', 'security'],
    difficulty: 'advanced',
    isFavorite: true
  },
  {
    id: '3',
    name: 'Python Data Analysis',
    description: 'Data analysis script with pandas, matplotlib, and statistical functions',
    category: 'Data Science',
    language: 'python',
    code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Set style for better visualizations
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class DataAnalyzer:
    def __init__(self, file_path):
        """Initialize the analyzer with data from a CSV file."""
        self.df = pd.read_csv(file_path)
        self.original_df = self.df.copy()
        
    def get_basic_info(self):
        """Get basic information about the dataset."""
        print("Dataset Shape:", self.df.shape)
        print("\\nColumn Names:", self.df.columns.tolist())
        print("\\nData Types:")
        print(self.df.dtypes)
        print("\\nMissing Values:")
        print(self.df.isnull().sum())
        print("\\nBasic Statistics:")
        print(self.df.describe())
        
    def clean_data(self):
        """Clean the dataset by handling missing values and outliers."""
        # Handle missing values
        numeric_columns = self.df.select_dtypes(include=[np.number]).columns
        
        for col in numeric_columns:
            # Fill missing values with median
            self.df[col].fillna(self.df[col].median(), inplace=True)
            
            # Remove outliers using IQR method
            Q1 = self.df[col].quantile(0.25)
            Q3 = self.df[col].quantile(0.75)
            IQR = Q3 - Q1
            lower_bound = Q1 - 1.5 * IQR
            upper_bound = Q3 + 1.5 * IQR
            
            self.df = self.df[(self.df[col] >= lower_bound) & 
                            (self.df[col] <= upper_bound)]
        
        print(f"Data cleaned. New shape: {self.df.shape}")
        
    def visualize_distributions(self):
        """Create distribution plots for numeric columns."""
        numeric_columns = self.df.select_dtypes(include=[np.number]).columns
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        axes = axes.ravel()
        
        for i, col in enumerate(numeric_columns[:4]):
            axes[i].hist(self.df[col], bins=30, alpha=0.7)
            axes[i].set_title(f'Distribution of {col}')
            axes[i].set_xlabel(col)
            axes[i].set_ylabel('Frequency')
        
        plt.tight_layout()
        plt.show()
        
    def correlation_analysis(self):
        """Perform correlation analysis and create heatmap."""
        numeric_df = self.df.select_dtypes(include=[np.number])
        correlation_matrix = numeric_df.corr()
        
        plt.figure(figsize=(12, 8))
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
        plt.title('Correlation Matrix')
        plt.tight_layout()
        plt.show()
        
        return correlation_matrix
        
    def build_regression_model(self, target_column):
        """Build and evaluate a linear regression model."""
        features = self.df.select_dtypes(include=[np.number]).columns.drop(target_column)
        X = self.df[features]
        y = self.df[target_column]
        
        # Split the data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale the features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train the model
        model = LinearRegression()
        model.fit(X_train_scaled, y_train)
        
        # Make predictions
        y_pred = model.predict(X_test_scaled)
        
        # Evaluate the model
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"Model Performance:")
        print(f"Mean Squared Error: {mse:.2f}")
        print(f"R-squared: {r2:.2f}")
        
        return model, scaler, mse, r2

# Example usage
if __name__ == "__main__":
    # Initialize analyzer with your data file
    analyzer = DataAnalyzer('your_data.csv')
    
    # Get basic information
    analyzer.get_basic_info()
    
    # Clean the data
    analyzer.clean_data()
    
    # Visualize distributions
    analyzer.visualize_distributions()
    
    # Perform correlation analysis
    correlation_matrix = analyzer.correlation_analysis()
    
    # Build regression model (replace 'target_column' with your target)
    # model, scaler, mse, r2 = analyzer.build_regression_model('target_column')`,
    author: 'Data Scientist',
    stars: 312,
    views: 2100,
    createdAt: '2024-01-08',
    tags: ['python', 'data-analysis', 'pandas', 'matplotlib', 'machine-learning'],
    difficulty: 'intermediate',
    isFavorite: false
  },
  {
    id: '4',
    name: 'CSS Animations Library',
    description: 'Collection of modern CSS animations and transitions',
    category: 'Frontend',
    language: 'css',
    code: `/* CSS Animations Library */

/* Fade In Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

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

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Slide Animations */
@keyframes slideInUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes slideInDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

/* Bounce Animation */
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

/* Pulse Animation */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* Shake Animation */
@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-10px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(10px);
  }
}

/* Rotate Animation */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Animation Classes */
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

.fade-in-down {
  animation: fadeInDown 0.6s ease-out;
}

.fade-in-left {
  animation: fadeInLeft 0.6s ease-out;
}

.fade-in-right {
  animation: fadeInRight 0.6s ease-out;
}

.slide-in-up {
  animation: slideInUp 0.6s ease-out;
}

.slide-in-down {
  animation: slideInDown 0.6s ease-out;
}

.bounce {
  animation: bounce 1s infinite;
}

.pulse {
  animation: pulse 2s infinite;
}

.shake {
  animation: shake 0.5s;
}

.rotate {
  animation: rotate 2s linear infinite;
}

/* Hover Effects */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.hover-scale {
  transition: transform 0.3s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-rotate {
  transition: transform 0.3s ease;
}

.hover-rotate:hover {
  transform: rotate(5deg);
}

/* Loading Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Gradient Animation */
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.animated-gradient {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}`,
    author: 'CSS Wizard',
    stars: 428,
    views: 3200,
    createdAt: '2024-01-05',
    tags: ['css', 'animations', 'transitions', 'ui', 'frontend'],
    difficulty: 'beginner',
    isFavorite: true
  },
  {
    id: '5',
    name: 'Algorithm: Quick Sort',
    description: 'Implementation of quick sort algorithm with visualization',
    category: 'Algorithms',
    language: 'javascript',
    code: `// Quick Sort Algorithm Implementation
class QuickSort {
  constructor() {
    this.comparisons = 0;
    this.swaps = 0;
  }

  // Main quick sort function
  quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
      // Find the partition index
      const partitionIndex = this.partition(arr, low, high);
      
      // Recursively sort elements before and after partition
      this.quickSort(arr, low, partitionIndex - 1);
      this.quickSort(arr, partitionIndex + 1, high);
    }
    return arr;
  }

  // Partition function
  partition(arr, low, high) {
    // Choose the rightmost element as pivot
    const pivot = arr[high];
    
    // Index of smaller element
    let i = low - 1;

    for (let j = low; j < high; j++) {
      this.comparisons++;
      
      // If current element is smaller than or equal to pivot
      if (arr[j] <= pivot) {
        i++;
        this.swap(arr, i, j);
      }
    }

    // Swap the pivot element with the element at index i + 1
    this.swap(arr, i + 1, high);
    
    return i + 1;
  }

  // Swap function
  swap(arr, i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
    this.swaps++;
  }

  // Reset counters
  reset() {
    this.comparisons = 0;
    this.swaps = 0;
  }

  // Get statistics
  getStats() {
    return {
      comparisons: this.comparisons,
      swaps: this.swaps
    };
  }
}

// Visualization helper
class QuickSortVisualizer {
  constructor() {
    this.steps = [];
  }

  // Quick sort with step recording for visualization
  quickSortWithSteps(arr) {
    this.steps = [];
    const arrCopy = [...arr];
    this.quickSortHelper(arrCopy, 0, arrCopy.length - 1);
    return { sortedArray: arrCopy, steps: this.steps };
  }

  quickSortHelper(arr, low, high) {
    if (low < high) {
      const partitionIndex = this.partitionWithSteps(arr, low, high);
      this.quickSortHelper(arr, low, partitionIndex - 1);
      this.quickSortHelper(arr, partitionIndex + 1, high);
    }
  }

  partitionWithSteps(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;

    // Record step: pivot selection
    this.steps.push({
      type: 'pivot',
      indices: [high],
      array: [...arr],
      pivot: pivot
    });

    for (let j = low; j < high; j++) {
      // Record step: comparison
      this.steps.push({
        type: 'compare',
        indices: [j, high],
        array: [...arr]
      });

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          // Record step: swap
          this.steps.push({
            type: 'swap',
            indices: [i, j],
            array: [...arr]
          });
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    }

    // Final swap with pivot
    if (i + 1 !== high) {
      this.steps.push({
        type: 'swap',
        indices: [i + 1, high],
        array: [...arr]
      });
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    }

    return i + 1;
  }
}

// Usage examples
const quickSort = new QuickSort();

// Example 1: Basic usage
const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
console.log('Original array:', unsortedArray);

quickSort.reset();
const sortedArray = quickSort.quickSort([...unsortedArray]);
console.log('Sorted array:', sortedArray);
console.log('Statistics:', quickSort.getStats());

// Example 2: With visualization
const visualizer = new QuickSortVisualizer();
const { sortedArray: visualizedArray, steps } = visualizer.quickSortWithSteps([...unsortedArray]);

console.log('\\nVisualization steps:');
steps.forEach((step, index) => {
  console.log(\`Step \${index + 1}: \${step.type}\`, step.indices, step.array);
});

// Example 3: Performance test
function performanceTest() {
  const sizes = [100, 1000, 5000];
  
  sizes.forEach(size => {
    const randomArray = Array.from({ length: size }, () => Math.floor(Math.random() * 1000));
    
    const startTime = performance.now();
    quickSort.reset();
    quickSort.quickSort([...randomArray]);
    const endTime = performance.now();
    
    console.log(\`\\nArray size: \${size}\`);
    console.log(\`Time taken: \${(endTime - startTime).toFixed(2)} ms\`);
    console.log(\`Comparisons: \${quickSort.comparisons}\`);
    console.log(\`Swaps: \${quickSort.swaps}\`);
  });
}

// Run performance test
performanceTest();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QuickSort, QuickSortVisualizer };
}`,
    author: 'Algorithm Expert',
    stars: 156,
    views: 890,
    createdAt: '2024-01-12',
    tags: ['algorithms', 'sorting', 'quick-sort', 'visualization', 'performance'],
    difficulty: 'intermediate',
    isFavorite: false
  }
]

export default function CodeTemplatesLibrary() {
  const [templates, setTemplates] = useState<CodeTemplate[]>(CODE_TEMPLATES)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [sortBy, setSortBy] = useState('stars')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate | null>(null)

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))]
  const languages = ['all', ...Array.from(new Set(templates.map(t => t.language)))]
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced']

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesLanguage = selectedLanguage === 'all' || template.language === selectedLanguage
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesLanguage && matchesDifficulty
  }).sort((a, b) => {
    switch (sortBy) {
      case 'stars':
        return b.stars - a.stars
      case 'views':
        return b.views - a.views
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const handleDownloadCode = (template: CodeTemplate) => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      css: 'css',
      html: 'html',
      json: 'json'
    }
    
    const blob = new Blob([template.code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${template.name.replace(/\s+/g, '-').toLowerCase()}.${extensions[template.language] || 'txt'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const toggleFavorite = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isFavorite: !template.isFavorite }
        : template
    ))
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

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Code Templates & Snippets
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover and share high-quality code templates and snippets
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Search */}
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Language Filter */}
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(language => (
                    <SelectItem key={language} value={language}>
                      <span className="flex items-center space-x-2">
                        <span>{getLanguageIcon(language)}</span>
                        <span>{language.charAt(0).toUpperCase() + language.slice(1)}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Difficulty Filter */}
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stars">Most Stars</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {filteredTemplates.length} templates found
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getLanguageIcon(template.language)}</span>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(template.id)}
                    >
                      <Heart className={`h-4 w-4 ${template.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                  
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{template.category}</Badge>
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        {template.stars}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {template.views}
                      </span>
                    </div>
                    <span>by {template.author}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyCode(template.code)}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadCode(template)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-xl">{getLanguageIcon(template.language)}</span>
                        <h3 className="text-lg font-semibold">{template.name}</h3>
                        <Badge variant="secondary">{template.category}</Badge>
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(template.id)}
                        >
                          <Heart className={`h-4 w-4 ${template.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {template.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {template.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1" />
                            {template.stars}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {template.views}
                          </span>
                          <span>by {template.author}</span>
                          <span>{new Date(template.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyCode(template.code)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadCode(template)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setSelectedTemplate(template)}
                          >
                            View Code
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Template Detail Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{getLanguageIcon(selectedTemplate.language)}</span>
                      <h2 className="text-2xl font-bold">{selectedTemplate.name}</h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedTemplate.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    ×
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="overflow-auto">
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
                  <pre>{selectedTemplate.code}</pre>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button
                    onClick={() => handleCopyCode(selectedTemplate.code)}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadCode(selectedTemplate)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}