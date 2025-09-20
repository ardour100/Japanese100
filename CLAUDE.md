# 🌸 Japanese Kanji Learning App - Claude Code Documentation

A beautiful Next.js application for learning the most frequent Japanese Kanji characters with an elegant sakura (cherry blossom) theme.

## Project Description

This is a modern web application designed to help users learn Japanese Kanji characters in an interactive and visually appealing way. The app features a beautiful cherry blossom-inspired design with animated Japanese cultural elements and provides comprehensive information about each Kanji character including pronunciation, meaning, and example usage.

## Technology Stack

- **Framework**: Next.js 15.5.3 with App Router and Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom sakura theme
- **Font**: Noto Sans JP for proper Japanese character display
- **Icons**: Heroicons React 2.2.0
- **Audio**: Web Speech API for pronunciation
- **Runtime**: React 19.1.0 with React DOM 19.1.0

## Setup Instructions

### Prerequisites
- Node.js (recommended: latest LTS version)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd kanji-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## Development Commands

- **Development server**: `npm run dev` - Starts Next.js development server with Turbopack
- **Production build**: `npm run build` - Creates optimized production build with Turbopack
- **Production server**: `npm start` - Runs the production build
- **Linting**: `npm run lint` - Runs ESLint with Next.js configuration

## Project Structure

```
kanji-app/
├── src/
│   ├── app/
│   │   ├── kanji/[id]/
│   │   │   └── page.tsx          # Individual Kanji detail pages
│   │   ├── layout.tsx            # Root layout with Japanese font
│   │   ├── page.tsx              # Main grid page with pagination
│   │   ├── globals.css           # Global styles with Tailwind
│   │   └── favicon.ico           # App favicon
│   ├── components/
│   │   ├── JapaneseBackground.tsx # Animated background component
│   │   └── JapaneseIcons.tsx     # SVG icons for cultural elements
│   └── data/
│       ├── kanji.json            # Main Kanji data (1000+ characters)
│       └── kanji-backup.json     # Backup data file
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── next.config.ts                # Next.js configuration
├── eslint.config.mjs             # ESLint configuration
└── postcss.config.mjs            # PostCSS configuration
```

## Features

### Core Features

1. **🌸 Sakura Theme**
   - Beautiful cherry blossom-inspired color palette
   - Soft pink and rose gradients throughout the UI
   - Animated floating sakura petals background

2. **📱 Responsive Design**
   - Mobile-first design approach
   - Optimized layouts for mobile, tablet, and desktop
   - Touch-friendly interface elements

3. **🎌 Cultural Background Elements**
   - Animated SVG icons including:
     - 🌸 Sakura (Cherry Blossoms) with floating animations
     - ⛩️ Torii Gates (traditional shrine gates)
     - 🍣 Sushi (Japanese cuisine representation)
     - 🐟 Koi Fish (symbols of perseverance)
     - 👘 Kimono (traditional clothing)
     - 🤖 Doraemon (cultural icon)

### Learning Features

4. **📊 Paginated Grid View**
   - Interactive 10x10 grid layout showing 50 kanji per page
   - Hover effects with scale animations
   - Clean navigation between pages
   - Progress indicators showing current position

5. **📖 Detailed Character Information**
   - Large, clear kanji character display
   - Romaji pronunciation prominently displayed
   - Hiragana readings in themed sections
   - English meanings with word class information
   - Example sentences with contextual usage

6. **🔄 Multi-Entry Support**
   - Support for kanji with multiple readings/meanings
   - Toggle between different word classes (noun, verb, etc.)
   - Organized entry selection interface

7. **🧭 Intuitive Navigation**
   - Previous/Next navigation between kanji
   - Direct links back to grid view
   - Page-based navigation system
   - Progress tracking (showing X of Y total)

### Technical Features

8. **⚡ Performance Optimized**
   - Next.js App Router for optimal routing
   - Turbopack for faster development builds
   - Suspense boundaries for loading states
   - Client-side navigation for smooth UX

9. **🎨 Modern UI/UX**
   - Smooth transitions and hover effects
   - Gradient backgrounds and shadows
   - Consistent cherry blossom color scheme
   - Accessible design patterns

10. **📱 Mobile Experience**
    - Touch-optimized grid interactions
    - Responsive typography scaling
    - Mobile-friendly navigation
    - Optimized spacing and sizing

## Data Structure

Each Kanji entry in `src/data/kanji.json` contains:

```typescript
interface KanjiItem {
  id: number;           // Unique identifier (1-based)
  kanji: string;        // The kanji character
  entries: KanjiEntry[]; // Array of different readings/meanings
}

interface KanjiEntry {
  entryId: number;      // Unique entry identifier
  romaji: string;       // Romanized pronunciation
  hiragana: string;     // Hiragana reading
  meaning: string;      // English meaning
  wordClass: string;    // Word type (noun, verb, adjective, etc.)
  example: string;      // Example sentence in Japanese with English
}
```

## Deployment Instructions

### Vercel (Recommended)
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy
4. Your app will be available at the provided Vercel URL

### Manual Deployment
1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Deploy to your hosting provider** of choice (AWS, DigitalOcean, etc.)

### Environment Variables
No environment variables are required for basic functionality.

## Development Notes

- **Font Loading**: Uses Noto Sans JP for proper Japanese character rendering
- **Path Aliases**: `@/*` maps to `./src/*` for cleaner imports
- **TypeScript**: Strict mode enabled with full type checking
- **ESLint**: Configured with Next.js recommended rules
- **Tailwind**: Custom theme extending default with sakura colors

## Browser Compatibility

- Modern browsers with ES2017+ support
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing Guidelines

When contributing to this project:

1. Follow the existing code style and conventions
2. Use TypeScript for all new components
3. Maintain the sakura theme color palette
4. Test on both desktop and mobile devices
5. Update this documentation for any new features

## License

This project is open source and available under the MIT License.