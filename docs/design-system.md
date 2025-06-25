# Design System

Study Buddy's design system provides a consistent, accessible, and delightful user experience across all platforms and devices.

## Design Principles

### 1. 🎓 Education-Focused
- **Clear Hierarchy**: Information is organized logically for learning
- **Readable Typography**: Optimized for extended reading sessions
- **Distraction-Free**: Clean interface promotes focus on learning

### 2. 🛡️ Privacy-First
- **Transparent Actions**: Users understand what's happening with their data
- **Local Control**: All settings and data remain on user's device
- **No Dark Patterns**: Honest and straightforward user interactions

### 3. ✨ Inspirational
- **Empowering Language**: "Powered by your imagination and AI"
- **Positive Feedback**: Encouraging and supportive interactions
- **Growth Mindset**: Interface promotes curiosity and exploration

### 4. 🌍 Inclusive
- **Accessibility**: Meets WCAG 2.1 AA standards
- **Responsive Design**: Works on all screen sizes
- **Keyboard Navigation**: Full functionality without mouse

## Visual Identity

### Brand Colors

```css
/* Primary Colors */
--blue-600: #2563eb;      /* Primary brand color */
--blue-500: #3b82f6;      /* Secondary brand color */
--blue-400: #60a5fa;      /* Accent color */

/* Neutral Colors */
--gray-900: #111827;      /* Primary text */
--gray-700: #374151;      /* Secondary text */
--gray-500: #6b7280;      /* Muted text */
--gray-200: #e5e7eb;      /* Border color */
--gray-100: #f3f4f6;      /* Background tint */

/* Semantic Colors */
--green-500: #10b981;     /* Success */
--red-500: #ef4444;       /* Error */
--yellow-500: #f59e0b;    /* Warning */
```

### Color Usage

| Color | Usage | Example |
|-------|-------|---------|
| Blue 600/500 | Primary actions, links, highlights | "Generate Tutor" button |
| Gray 900 | Primary text content | Headings, body text |
| Gray 700 | Secondary text | Descriptions, metadata |
| Gray 500 | Muted text | Placeholders, disabled states |
| Gray 200 | Borders and dividers | Input borders, card outlines |

### Typography

**Primary Font**: Montserrat (sans-serif)
- **Purpose**: Clean, modern, highly legible
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Usage**: All UI text, headings, body content

```css
/* Typography Scale */
.text-6xl { font-size: 3.75rem; }  /* Main headings */
.text-4xl { font-size: 2.25rem; }  /* Section headings */
.text-xl { font-size: 1.25rem; }   /* Subheadings */
.text-base { font-size: 1rem; }    /* Body text */
.text-sm { font-size: 0.875rem; }  /* Small text */
```

### Icons and Symbols

**Primary Icon**: 🎓 Graduation Cap Emoji
- **Usage**: Logo, app icon, branding elements
- **Rationale**: Universal symbol for education and learning

**Supporting Icons**: 
- ✨ Sparkle (inspiration, AI magic)
- 🔍 Magnifying glass (search functionality)
- ⚙️ Gear (settings and configuration)
- 📚 Books (learning and knowledge)

## Layout System

### Grid Structure

Based on CSS Grid and Flexbox with Tailwind CSS utilities:

```css
/* Container Sizes */
max-w-3xl   /* 768px - Main content width */
max-w-7xl   /* 1280px - Full page width */
max-w-sm    /* 384px - Narrow content */

/* Spacing Scale */
p-2: 0.5rem   /* 8px */
p-4: 1rem     /* 16px */
p-6: 1.5rem   /* 24px */
p-8: 2rem     /* 32px */
```

### Component Layout Patterns

#### 1. Centered Content
```jsx
<div className="mx-auto max-w-3xl flex flex-col items-center">
  {/* Content */}
</div>
```

#### 2. Card Layout
```jsx
<div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
  {/* Card content */}
</div>
```

#### 3. Form Layout
```jsx
<div className="space-y-4">
  <div className="space-y-2">
    <label className="text-sm font-medium">
    <input className="w-full rounded border border-gray-200 px-3 py-2">
  </div>
</div>
```

## Component Library

### Buttons

#### Primary Button
```jsx
<button className="rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
  Generate Tutor
</button>
```

#### Secondary Button  
```jsx
<button className="rounded border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50">
  Cancel
</button>
```

#### Suggestion Chip
```jsx
<div className="flex h-[35px] cursor-pointer items-center justify-center gap-[5px] rounded border border-solid border-[#C1C1C1] px-2.5 py-2 transition hover:bg-gray-200">
  <Image src={icon} alt={name} width={18} height={16} />
  <span className="text-sm font-light">{name}</span>
</div>
```

### Form Elements

#### Text Input
```jsx
<input 
  type="text"
  className="w-full rounded border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
  placeholder="Enter your question..."
/>
```

#### Select Dropdown
```jsx
<select className="w-full rounded border border-gray-200 px-3 py-2 bg-white">
  <option>Elementary</option>
  <option>Middle School</option>
  <option>High School</option>
</select>
```

#### Textarea
```jsx
<textarea 
  className="w-full rounded border border-gray-200 px-3 py-2 resize-none focus:border-blue-500"
  rows="4"
  placeholder="Ask a question..."
/>
```

### Navigation

#### Header Navigation
```jsx
<header className="bg-white border-b border-gray-200">
  <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
    {/* Logo and title */}
    {/* Navigation links */}
  </div>
</header>
```

#### Footer
```jsx
<footer className="border-t border-gray-200 bg-gray-50 py-6">
  <div className="mx-auto max-w-7xl px-4 text-center">
    {/* Links and attribution */}
  </div>
</footer>
```

### Content Containers

#### Main Content Area
```jsx
<main className="flex-1 bg-white">
  <div className="mx-auto max-w-3xl px-4 py-8">
    {/* Page content */}
  </div>
</main>
```

#### Chat Interface
```jsx
<div className="flex h-full flex-col">
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {/* Messages */}
  </div>
  <div className="border-t border-gray-200 p-4">
    {/* Input area */}
  </div>
</div>
```

## Responsive Design

### Breakpoint System

```css
/* Mobile First Approach */
sm: 640px    /* Small tablets and large phones */
md: 768px    /* Tablets */
lg: 1024px   /* Small laptops */
xl: 1280px   /* Desktops */
2xl: 1536px  /* Large desktops */
```

### Responsive Patterns

#### Typography
```jsx
<h1 className="text-4xl sm:text-6xl">
  Your Personal Tutor
</h1>
```

#### Layout
```jsx
<div className="flex flex-col lg:flex-row gap-6">
  <div className="flex-1">{/* Main content */}</div>
  <div className="w-full lg:w-64">{/* Sidebar */}</div>
</div>
```

#### Navigation
```jsx
<nav className="hidden md:flex space-x-6">
  {/* Desktop navigation */}
</nav>
<button className="md:hidden">
  {/* Mobile menu toggle */}
</button>
```

## Accessibility

### Color Contrast
- **AA Compliance**: All text meets 4.5:1 contrast ratio
- **AAA Preferred**: Important content meets 7:1 contrast ratio
- **Focus Indicators**: Clear focus states for keyboard navigation

### Keyboard Navigation
```jsx
// Focus management
<button 
  className="focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Submit
</button>
```

### Screen Reader Support
```jsx
// Semantic HTML and ARIA labels
<button aria-label="Generate personalized tutor for this topic">
  Generate Tutor
</button>

<div role="status" aria-live="polite">
  {loadingMessage}
</div>
```

## Animation and Interaction

### Hover Effects
```css
/* Subtle hover transitions */
.hover\:bg-gray-200 {
  transition: background-color 0.15s ease-in-out;
}

.hover\:scale-105 {
  transition: transform 0.15s ease-in-out;
}
```

### Loading States
```jsx
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

### Feedback Animation
```jsx
// Success state
<div className="bg-green-50 border border-green-200 rounded p-3">
  <div className="flex items-center">
    <span className="text-green-600">✓</span>
    <span className="ml-2 text-green-800">Settings saved!</span>
  </div>
</div>
```

## Dark Mode Considerations

While Study Buddy currently uses a light theme, the design system is prepared for dark mode:

```css
/* CSS Custom Properties for theme switching */
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --border-color: #e5e7eb;
}

[data-theme="dark"] {
  --bg-primary: #1f2937;
  --text-primary: #f9fafb;
  --border-color: #374151;
}
```

## Component Documentation

### Usage Guidelines

#### Do's ✅
- Use consistent spacing from the scale (4, 8, 16, 24px)
- Apply hover states to interactive elements
- Include proper ARIA labels and semantic HTML
- Use the established color palette
- Test on multiple screen sizes

#### Don'ts ❌
- Don't use arbitrary spacing values
- Don't skip focus indicators
- Don't use low-contrast color combinations
- Don't break responsive layout patterns
- Don't forget loading and error states

### Code Examples

See the `/components` directory for implementation examples:
- `Header.tsx` - Brand identity and navigation
- `Hero.tsx` - Landing page design patterns
- `Chat.tsx` - Interactive content display
- `Footer.tsx` - Secondary navigation and links

---

*This design system evolves with the product. For the latest implementations, see the [GitHub repository](https://github.com/michael-borck/study-buddy).*