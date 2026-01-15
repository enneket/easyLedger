# EasyLedger

A local-first, privacy-focused personal finance tracker built with modern web technologies and optimized for mobile devices.

## 🚀 Features

- **Dashboard**: Quick overview of your monthly income, expenses, and balance.
- **Transaction Management**: Easily add income and expenses with categories, dates, and notes.
- **Visual Reports**: Analyze your spending habits with interactive pie charts and bar graphs.
- **Multi-Account Support**: Manage multiple ledgers (e.g., Personal, Business, Travel).
- **Data Privacy**:
  - **Web**: Data stored in your browser's LocalStorage.
  - **Mobile**: Data stored in a local SQLite database.
  - **Backup**: Export and import your data as JSON files.
- **Cross-Platform**: Works on the web and as a native mobile app (Android/iOS).

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Charts**: Chart.js, react-chartjs-2
- **Forms**: React Hook Form, Zod
- **Mobile Runtime**: Capacitor
- **Database**:
  - Web: LocalStorage (via Adapter pattern)
  - Mobile: SQLite (@capacitor-community/sqlite)

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/easyLedger.git

# Install dependencies
npm install
```

### Development

```bash
# Start the web development server
npm run dev
```

### Testing

```bash
# Run unit and component tests
npm test
```

## 📱 Mobile Development

This project uses Capacitor to wrap the web app into a native mobile application.

### Android

```bash
# Sync web assets to native project
npx cap sync android

# Open Android Studio
npx cap open android
```

### iOS

```bash
# Sync web assets to native project
npx cap sync ios

# Open Xcode
npx cap open ios
```

## 📂 Project Structure

```
src/
├── components/   # Reusable UI components
├── db/           # Database adapters (Web/Mobile)
├── hooks/        # Custom hooks (useStore)
├── pages/        # Route pages (Dashboard, Reports, etc.)
├── types/        # TypeScript definitions
├── lib/          # Utilities
└── App.tsx       # Main application component
```

## 📄 License

MIT
