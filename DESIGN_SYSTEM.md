# AetherOS Design System

## Overview
AetherOS is a premium enterprise AI operational intelligence platform designed for infrastructure teams managing global-scale systems. The design language prioritizes enterprise trust, operational clarity, scalable information hierarchy, intelligent motion, premium minimalism, and AI-native workflows.

## Design Philosophy

### Core Principles
1. **Enterprise Trust** - Professional, reliable, and production-grade aesthetics
2. **Operational Clarity** - Information-first layouts with clear hierarchies
3. **Intelligent Motion** - Purposeful animations that communicate system state
4. **Premium Minimalism** - Clean, uncluttered interfaces with strategic use of space
5. **AI-Native** - Designed for AI-first workflows and autonomous intelligence

### Visual Inspiration
- Linear (clarity and workflow)
- Stripe Dashboard (trust and professionalism)
- Vercel (modern minimalism)
- Datadog (operational intelligence)
- Apple Vision Pro (spatial design and depth)

## Color System

### Base Colors
```css
--graphite: #0a0b0f          /* Primary background */
--slate-dark: #13151c        /* Card backgrounds */
--slate-medium: #1e2129      /* Secondary surfaces */
--slate-light: #2a2d38       /* Tertiary surfaces */
```

### Accent Colors
```css
--electric-blue: #0ea5e9     /* Primary actions, links */
--cyan: #06b6d4              /* Secondary accents */
--cyan-light: #22d3ee        /* Highlights */
```

### Semantic Colors
```css
--success: #22c55e           /* Healthy states, positive metrics */
--warning: #f59e0b           /* Warnings, medium severity */
--error: #ef4444             /* Critical states, errors */
--info: #0ea5e9              /* Informational states */
--purple: #8b5cf6            /* AI/ML features, predictions */
```

### Text Colors
```css
--text-primary: #e8e9ed      /* Primary text */
--text-secondary: #a1a1aa    /* Secondary text */
--text-tertiary: #71717a     /* Tertiary text, captions */
```

## Typography

### Font Family
- Primary: **Inter** (Google Fonts)
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

### Font Weights
- Regular: 400 (body text)
- Medium: 500 (labels, buttons)
- Semibold: 600 (headings, emphasis)
- Bold: 700 (large headings, metrics)

### Type Scale
- Display: 32px/2rem (h1, hero text)
- Heading 1: 24px/1.5rem (page titles)
- Heading 2: 20px/1.25rem (section titles)
- Heading 3: 18px/1.125rem (subsections)
- Body: 14px/0.875rem (default text)
- Small: 12px/0.75rem (captions, metadata)
- Tiny: 10px/0.625rem (badges, tags)

## Spacing System

Based on 4px grid:
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)
- 3xl: 64px (4rem)

## Components

### Cards
- Background: `#13151c` with 60% opacity + backdrop blur
- Border: `rgba(255, 255, 255, 0.05)`
- Border radius: 8px (0.5rem)
- Padding: 20px (1.25rem)
- Hover state: border `rgba(14, 165, 233, 0.3)`

### Buttons
- Primary: Gradient from `#0ea5e9` to `#06b6d4`
- Secondary: `bg-white/5` hover `bg-white/10`
- Border radius: 8px
- Padding: 12px 24px
- Font weight: 500

### Badges
- Small text: 10px
- Padding: 4px 8px
- Border radius: 4px
- Background: 10% opacity of semantic color
- Text: full semantic color

### Charts
- Grid: `rgba(255, 255, 255, 0.05)`
- Axes: `rgba(255, 255, 255, 0.3)`
- Primary line: `#0ea5e9`
- Secondary line: `#06b6d4`
- Gradients: Use linear gradients with 30% opacity start

## Layout Structure

### Three-Column Layout
1. **Left Sidebar** (256px)
   - Navigation
   - Branding
   - User profile
   
2. **Main Content** (flex-1)
   - Dashboard views
   - Data visualizations
   - Operational content
   
3. **Right Intelligence Panel** (384px)
   - AI reasoning
   - Recommendations
   - Context-aware insights

### Navigation
- Fixed left sidebar
- Active state: background `white/5` with blue border
- Icons: 16px (lucide-react)
- Labels: 14px medium weight

## Motion & Animation

### Animation Principles
1. **Purposeful** - Every animation communicates system state
2. **Fast** - Durations between 150ms - 600ms
3. **Smooth** - Use spring animations for natural feel
4. **Subtle** - Avoid distracting from content

### Common Transitions
```typescript
// Page entrance
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}

// Card hover
whileHover={{ scale: 1.02, y: -2 }}

// Active state (nav)
transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
```

### Animated Elements
- Pulse: Critical alerts, active indicators
- Slide: Panel transitions, navigation
- Fade: Loading states, content changes
- Scale: Hover states, button interactions
- Progress bars: Confidence scores, metrics

## Glassmorphism

Strategic use only:
- Backdrop blur: `blur(12px)`
- Background opacity: 60-80%
- Border: `rgba(255, 255, 255, 0.1)`
- Use for: Cards, modals, overlays

## 3D Elements

### Landing Page
- Three.js animated sphere
- Soft glow and distortion
- Orbital controls
- Cinematic presentation

### Infrastructure Galaxy
- Service nodes as spheres
- Connection lines between services
- Color-coded health states
- Interactive topology

### Guidelines
- Use 3D sparingly in operational views
- Functional 3D only (topology, relationships)
- Avoid decorative 3D in dashboards
- Maintain performance (optimize geometry)

## Data Visualization

### Chart Types
1. **Line Charts** - Time-series metrics
2. **Area Charts** - Performance trends
3. **Bar Charts** - Cost comparisons
4. **Status Indicators** - Health, severity

### Chart Styling
- Background: transparent
- Grid: subtle (`rgba(255,255,255,0.05)`)
- Tooltips: Dark background with border
- Lines: 2px stroke width
- No excessive decorations

## Accessibility

### Contrast Ratios
- Text on dark backgrounds: minimum 4.5:1
- Large text: minimum 3:1
- Interactive elements: clear hover/focus states

### Focus States
- Outline: `#0ea5e9` 2px
- Offset: 2px
- Visible on keyboard navigation

## States

### Health States
- Healthy: `#22c55e` (green)
- Warning: `#f59e0b` (amber)
- Degraded: `#f59e0b` (amber)
- Critical: `#ef4444` (red)
- Unknown: `#71717a` (gray)

### Loading States
- Skeleton screens with pulse
- Spinner: Primary blue color
- Progress bars with gradient

### Empty States
- Icon + message
- Suggested action
- Subtle background

## Best Practices

### Do's
✓ Use consistent spacing (4px grid)
✓ Maintain color hierarchy
✓ Animate state changes
✓ Provide clear feedback
✓ Use semantic colors
✓ Keep information density appropriate

### Don'ts
✗ Mix visual styles
✗ Overuse animations
✗ Create cluttered interfaces
✗ Use decorative 3D in dashboards
✗ Ignore accessibility
✗ Use bright, gaming-style colors

## Tech Stack

### Frontend
- React 18+
- Tailwind CSS 4.x
- Framer Motion (motion/react)
- Three.js + React Three Fiber
- Recharts
- Lucide React (icons)

### Design Tokens
All design tokens are defined in `/src/styles/theme.css` using CSS custom properties for easy theming and consistency.

## Views Architecture

### 1. Landing Page
Cinematic 3D experience with animated sphere, hero messaging, and feature grid.

### 2. Overview Dashboard
Command center with real-time metrics, performance charts, and incident feed.

### 3. Incidents View
AI-powered incident intelligence with root cause analysis and confidence scoring.

### 4. AI Agents View
Multi-agent orchestration dashboard showing agent status, tasks, and activity.

### 5. Predictions View
Predictive intelligence with forecasting charts and proactive recommendations.

### 6. Executive Dashboard
Business-level KPIs, SLA compliance, cost optimization, and AI summaries.

### 7. Infrastructure Galaxy
3D topology visualization with service nodes and dependency mapping.

### 8. Security View
Security intelligence with threat correlation and compliance monitoring.

### 9. Settings View
Configuration interface for notifications, integrations, and AI agents.

---

**AetherOS Design System v1.0**  
*Autonomous AI Operational Intelligence Platform*
