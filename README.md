# 🌸 漢字学習 - Japanese Kanji Learning

A beautiful Next.js application for learning the most frequent Japanese Kanji characters with an elegant theme.


## Features

- **🌸 Sakura Theme**: Beautiful cherry blossom-inspired color palette with soft pinks and roses
- **🎨 Japanese Cultural Background**: Animated SVG icons including:
  - 🌸 Sakura (Cherry Blossoms) - floating and spinning animations
  - ⛩️ Torii Gates - traditional shrine gates
  - 🍣 Sushi - representing Japanese cuisine
  - 🐟 Koi Fish - symbol of perseverance and strength
  - 👘 Kimono - traditional Japanese clothing
  - 🤖 Doraemon - beloved cultural icon
- **10x10 Interactive Grid**: Display 100 most frequent Japanese Kanji in an elegant grid layout
- **Detailed Character Pages**: Click any Kanji to view detailed information including:
  - Romaji pronunciation displayed prominently above the Kanji
  - Hiragana (ひらがな) and Katakana (カタカナ) readings in themed sections
  - Example sentence with the Kanji in context
  - Audio pronunciation using Web Speech API
- **Responsive Design**: Beautiful Tailwind CSS styling with Sakura aesthetics that works on all devices
- **Navigation**: Easy navigation between Kanji with Previous/Next buttons
- **Modern UI**: Cherry blossom gradients, floating animations, hover effects, and smooth transitions

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Noto Sans JP** font for proper Japanese character display
- **Heroicons** for beautiful icons
- **Web Speech API** for audio pronunciation

## Getting Started

1. Clone the repository or download the project files

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

```
src/
├── app/
│   ├── kanji/[id]/
│   │   └── page.tsx      # Individual Kanji detail pages
│   ├── layout.tsx        # Root layout with Japanese font
│   ├── page.tsx          # Main grid page
│   └── globals.css       # Global styles
└── data/
    └── kanji.json        # Kanji data with 100 most frequent characters
```

## Data Structure

Each Kanji entry includes:
- `id`: Unique identifier
- `kanji`: The character itself
- `romaji`: Romanized pronunciation
- `hiragana`: Hiragana reading
- `katakana`: Katakana reading
- `meaning`: English meaning
- `example`: Example sentence in Japanese
- `audio`: Audio file path (uses Web Speech API)

## Audio Features

The app uses the Web Speech API for pronunciation, providing:
- Japanese language synthesis (`ja-JP`)
- Controlled playback speed for clear pronunciation
- Visual feedback during audio playback

## Responsive Design

- **Mobile**: Optimized grid layout and typography
- **Tablet**: Enhanced spacing and larger text
- **Desktop**: Full-featured layout with hover effects

## Contributing

Feel free to contribute by:
- Adding more Kanji characters
- Improving the pronunciation data
- Enhancing the UI/UX
- Adding new features like favorites or progress tracking

## Quick Start

```bash
# Clone the repository
git clone https://github.com/ardour100/Japanese100.git
cd Japanese100

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## Screenshots

🌸 **Main Grid View**: Interactive 10x10 Kanji layout with hover effects
🎌 **Detail Page**: Comprehensive character information with audio
🎨 **Background**: Animated Japanese cultural icons

Experience the beauty of Japanese language learning! 🌸

## License

This project is open source and available under the MIT License.
