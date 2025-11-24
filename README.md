# 🎯 LeetVisual

A sleek, modern web application for visualizing and solving LeetCode problems with an integrated code editor and algorithm visualizations.

![LeetVisual](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=400&fit=crop)

## ✨ Features

### 🏠 Homepage
- **Problem Cards Grid**: Browse through LeetCode problems with beautiful card UI
- **Search & Filter**: Real-time search with difficulty and category filters
- **Responsive Design**: Fully responsive layout that works on all devices
- **Theme Toggle**: Seamless dark/light mode switching with system preference detection
- **Smooth Animations**: Framer Motion animations for delightful interactions

### 💻 Problem Viewer
- **Split Layout**: Problem description on the left, code editor on the right
- **Monaco Editor**: Industry-standard VS Code editor integration
- **Multi-Language Support**: Write code in Python, C, C++, and Java
- **Code Execution**: Run your code with Judge0 API integration
- **Syntax Highlighting**: Language-specific syntax highlighting
- **Real-time Output**: See execution results with success/error indicators

### 🎨 Algorithm Visualizer
- **Interactive Visualizations**: Watch algorithms come to life
- **Multiple Algorithms**:
  - Bubble Sort (sorting visualization)
  - Binary Search (search visualization)
  - DFS Tree Traversal (tree visualization with Canvas)
- **Playback Controls**: Play, pause, step forward/backward
- **Speed Control**: Adjust animation speed from 1% to 100%
- **Real-time Description**: See what the algorithm is doing at each step

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun package manager

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd leetvisual
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Judge0 API Setup (Optional)

The code execution feature works in **demo mode** by default. To enable real code execution:

1. **Get RapidAPI Key**
   - Sign up at [RapidAPI](https://rapidapi.com)
   - Subscribe to [Judge0 CE API](https://rapidapi.com/judge0-official/api/judge0-ce)
   - Copy your RapidAPI key

2. **Set Environment Variable**
   Create a `.env.local` file in the root directory:
   ```env
   RAPIDAPI_KEY=your_rapidapi_key_here
   ```

3. **Restart the server**
   ```bash
   npm run dev
   ```

Without the API key, the application will show mock execution results with your submitted code.

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Monaco Editor**: VS Code editor component
- **Shadcn/UI**: Beautiful UI components
- **Lucide React**: Icon library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Judge0 API**: Code execution engine
- **Axios**: HTTP client

## 📁 Project Structure

```
leetvisual/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── execute/          # Code execution API
│   │   ├── problems/[id]/        # Problem viewer page
│   │   ├── visualize/            # Algorithm visualizer
│   │   ├── layout.tsx            # Root layout with theme provider
│   │   ├── page.tsx              # Homepage
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── providers/
│   │   │   └── ThemeProvider.tsx # Theme context
│   │   ├── ui/                   # Shadcn UI components
│   │   ├── Navigation.tsx        # Header navigation
│   │   └── ProblemCard.tsx       # Problem card component
│   └── lib/
│       └── problems.ts           # Problem data
├── public/                       # Static assets
└── package.json
```

## 🎮 Usage

### Browse Problems
1. Navigate to the homepage
2. Use the search bar to find specific problems
3. Filter by difficulty (Easy, Medium, Hard) or category
4. Click on any problem card to view details

### Solve Problems
1. Select a problem from the homepage
2. Read the problem description, examples, and constraints
3. Choose your preferred programming language
4. Write your solution in the Monaco editor
5. Click "Run Code" to execute and see results

### Visualize Algorithms
1. Click "Visualize" in the navigation
2. Select an algorithm from the dropdown
3. Adjust the speed slider
4. Use playback controls to step through the algorithm
5. Watch the visualization and read the description

## 🎨 Theme Customization

The application supports both light and dark themes with smooth transitions. The theme is automatically detected from your system preferences and can be toggled manually using the sun/moon icon in the navigation.

## 🌟 Key Features Breakdown

### Animations
- **Page Transitions**: Smooth fade-in animations on page load
- **Card Hover Effects**: Elevated cards with subtle transformations
- **Code Execution Feedback**: Success/error indicators with icons
- **Visualization Controls**: Smooth state transitions

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Flexible grid layouts
- Touch-friendly controls

### Code Editor Features
- Auto-completion
- Syntax highlighting
- Line numbers
- Code folding
- Multi-language support
- Theme synchronization

### Algorithm Visualizations
- **Bubble Sort**: Visualize element comparisons and swaps with color-coded bars
- **Binary Search**: See the search space narrow down with highlighted elements
- **DFS Tree**: Canvas-based tree rendering with node traversal

## 🐛 Troubleshooting

### Monaco Editor not loading
- Ensure you have a stable internet connection
- Clear browser cache and reload

### Code execution not working
- Check if RAPIDAPI_KEY is set in `.env.local`
- Verify your RapidAPI subscription is active
- In demo mode, you'll see mock results

### Theme not persisting
- Enable cookies in your browser
- Check browser console for localStorage errors

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📧 Support

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**