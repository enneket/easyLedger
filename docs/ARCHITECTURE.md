# Architecture Guide

## Overview
**EasyLedger** is a local-first, privacy-focused personal finance tracker built with modern web technologies and wrapped for mobile platforms using Capacitor.

## Tech Stack

### Core
- **Framework**: React 18
- **Build Tool**: Vite 6
- **Language**: TypeScript 5.8
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React

### State Management
- **Global State**: Zustand v5
  - Lightweight, hook-based state management
  - Used for Accounts, Transactions, Categories, and UI state

### Routing
- **Router**: React Router v7
  - Uses `BrowserRouter` for web-like navigation
  - Layout-based routing structure

### Data Persistence
- **Architecture**: Adapter Pattern
  - `StorageAdapter` interface defines core CRUD operations
  - `WebStorageAdapter`: Uses `localStorage` for web/dev environment
  - `MobileStorageAdapter` (Planned): Will use `@capacitor-community/sqlite` for native mobile performance

### Mobile
- **Runtime**: Capacitor v8
  - Native plugins for file system, storage, etc.
  - Android/iOS target support

## Project Structure
```
src/
├── components/   # Reusable UI components
├── db/           # Database adapters and interfaces
├── hooks/        # Custom hooks (useStore, etc.)
├── pages/        # Route page components
├── types/        # TypeScript interfaces and types
├── lib/          # Utilities (clsx, tailwind-merge)
├── App.tsx       # Main router setup
└── main.tsx      # Entry point
```

## Data Flow
1. **User Action** -> **Component** triggers event
2. **Component** calls **Store Action** (Zustand)
3. **Store Action** calls **Storage Adapter**
4. **Storage Adapter** performs persistence (LocalStorage/SQLite)
5. **Store** updates state
6. **UI** re-renders reactively
