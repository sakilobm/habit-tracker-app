# Habit Tracker Software Architecture Documentation

> **Clean Architecture & Mobile System Design**: A multi-layered, scalable architectural standard for our React Native / Expo Habit Tracker, featuring headless UI logic isolation, atomic subcomponents, and declarative view shells.

---

## 1. System Overview & Technology Stack

*   **Runtime & Framework**: React Native 0.88.0 on Expo SDK 58 (Expo Router)
*   **State Management**: Zustand 5 (Reactive client store)
*   **Persistence**: SQLite (`expo-sqlite` synchronous WAL engine)
*   **Vector Graphics**: `react-native-svg` (custom curved notched dock, arc gauges)
*   **Styling & Design Tokens**: Soft Neomorphic & Modern Card Glassmorphism (Vibrant Indigo `#4F46E5`, `#6366F1`, Lavender `#818CF8`, Slate `#0F172A`)
*   **Haptics & Feedback**: `expo-haptics`

---

## 2. Directory Layout & Layering Architecture

```text
habit-tracker/
├── assets/                           # App icons, fonts, and splash screens
├── docs/                             # Architectural and build guides
│   ├── ARCHITECTURE.md
│   └── MULTI_APP_ENV_BUILD_GUIDE.md
├── src/
│   ├── app/                          # Declarative View Shells (< 150 lines per screen)
│   │   ├── _layout.tsx               # Root Navigation Stack & Theme Boundary
│   │   └── (tabs)/
│   │       ├── _layout.tsx           # Custom Notched Tab Bar & Modal Integration
│   │       ├── index.tsx             # Home Screen Shell (Routinr 3-way layout switch)
│   │       ├── discover.tsx          # Curated Routine Templates Shell
│   │       ├── stats.tsx             # Stats & Insights Shell (2x2 grid & arc gauge)
│   │       └── profile.tsx           # User Profile & Pro Feature Shell
│   ├── components/                   # Atomic, Reusable Presentation Components
│   │   ├── common/
│   │   │   ├── CurvedHeader.tsx      # Top indigo curved header with view switcher
│   │   │   └── CustomTabBar.tsx      # Notched SVG tab bar with floating + button
│   │   ├── home/
│   │   │   ├── AddHabitModal.tsx     # New habit creation modal
│   │   │   ├── HabitActionSheet.tsx  # Habit action bottom sheet modal
│   │   │   ├── HabitCardList.tsx     # Single-column habit card with striped bar
│   │   │   ├── HabitCardDual.tsx     # 2-column compact habit card
│   │   │   └── HabitCardGrid.tsx     # 4-column compact habit card
│   │   ├── stats/
│   │   │   ├── ConsistencyChart.tsx  # Daily vertical bar chart series
│   │   │   ├── StatsMetricCards.tsx  # 2x2 metric tiles (Consistency, Done, Missed, Run)
│   │   │   ├── SpeedometerArc.tsx    # SVG arc gauge with 3-step unlock milestone
│   │   │   └── ReflectionNoteCard.tsx# "How is it going? Write note" card
│   │   └── profile/
│   │       ├── ProfileHero.tsx       # Lavender header with avatar & email
│   │       └── UpgradeProCard.tsx    # Pro benefits banner with gold crown
│   ├── features/                     # Domain Feature Logic, Headless Hooks & Stores
│   │   ├── habits/
│   │   │   ├── hooks/
│   │   │   │   ├── useHomeHabits.ts      # View switches, completions, group filtering
│   │   │   │   └── useHabitActionSheet.ts# Modal actions, progress ratios, weekdays
│   │   │   └── stores/
│   │   │       └── habitStore.ts         # Reactive Zustand habit store
│   │   └── stats/
│   │       └── hooks/
│   │           └── useHabitStats.ts      # Analytics calculations & note persistence
│   ├── services/
│   │   └── db/                       # Local SQLite Data Vault
│   │       ├── database.ts           # SQLite connection & table creation
│   │       ├── habitRepository.ts    # Habit & log CRUD operations
│   │       └── seedData.ts           # Pre-seeded habits matching screenshots
│   └── types/
│       └── habit.ts                  # Habit, Log, and Statistics TypeScript models
```

---

## 3. Data Contracts & Database Schema

```sql
CREATE TABLE IF NOT EXISTS habits (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'sparkles',
  category TEXT DEFAULT 'mindfulness',
  time_of_day TEXT DEFAULT 'anytime',
  frequency_type TEXT DEFAULT 'every_day',
  frequency_days TEXT DEFAULT '1,2,3,4,5,6,7',
  target_count INTEGER DEFAULT 1,
  unit TEXT DEFAULT 'times',
  created_at TEXT NOT NULL,
  archived INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS habit_logs (
  id TEXT PRIMARY KEY,
  habit_id TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL, -- 'completed', 'skipped', 'pending'
  value INTEGER DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
);
```

---

## 4. Design System Tokens (Routinr-Exact Fidelity)

*   **Primary Accent**: `#4F46E5` / `#6366F1`
*   **Header Gradient & Bleeds**: `#3730A3` (Home) & `#818CF8` (Profile)
*   **Card Background**: `#FFFFFF` with `#EEF2F6` borders
*   **App Background**: `#F8FAFC`
*   **Streak Accent**: `#F59E0B` (Fire Flame)
*   **Pro Accent**: `#FBBF24` (Gold Crown 👑)

---

## 5. Multi-Layer Refactoring & Headless Logic Standards

To ensure long-term maintainability, zero UI regression, and separation of concerns, our codebase enforces the following architectural standards:

### 1. View Shell Decoupling (< 150 Lines)
*   All screen entry files located in `src/app/` are strict **Declarative View Shells**.
*   No screen view shell may exceed **150 lines of code**.
*   View shells contain **zero inline business calculations, raw database calls, or complex state handlers**. They simply mount headless hooks and delegate UI rendering to atomic components.

### 2. Headless Feature Hooks (`src/features/[feature_name]/hooks/`)
*   All component interactions, sheet/modal toggles, timer loops, calculations, device haptics (`Haptics.impactAsync`), and data transformations belong in dedicated custom hooks inside `src/features/[feature_name]/hooks/`.
*   Hooks return a standardized, clean API of reactive states (`data`, `isLoading`, `status`) and callback handlers (`handleToggle`, `handleSkip`, `handleDelete`).

### 3. Atomic Subcomponent Isolation (`src/components/[feature_name]/`)
*   Nested UI components (e.g. `HabitCardList`, `SpeedometerArc`, `StatsMetricCards`) are extracted into dedicated atomic files under `src/components/[feature_name]/`.
*   Each component receives strictly typed props and remains completely agnostic of the database or router implementation.

### 4. Professional Inline JSDoc Specifications
*   Every newly generated hook, store, and component includes comprehensive JSDoc headers specifying:
    *   Component purpose and visual source mapping.
    *   Props interfaces and callback contracts.
    *   State mutations and haptic behaviors.

