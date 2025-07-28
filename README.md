# Dark Horse Radar

A modern bag tracking and management application built with React, TypeScript, and Tailwind CSS.

## Overview

Dark Horse Radar is a comprehensive bag tracking system designed to help users monitor and manage their belongings through RFID technology. The application provides real-time tracking, advanced filtering, analytics, and smart reminders to ensure users never lose their essential items.

## Features

### Core Functionality
- **Real-time Item Tracking**: Monitor the status and location of tracked items
- **Advanced Filtering & Sorting**: Multi-select filters, date ranges, and custom presets
- **Smart Reminders**: Time-based and location-based reminder system
- **Analytics Dashboard**: Comprehensive data visualization and reporting
- **User Profile Management**: Customizable settings and preferences

### Advanced Features
- **Drag & Drop Interface**: Intuitive item reordering and management
- **Bulk Operations**: Select and manage multiple items simultaneously
- **Advanced Search**: Fuzzy search across item names, descriptions, and categories
- **Filter Presets**: Save and load custom filter combinations
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Accessibility Features
- **Screen Reader Support**: Full ARIA compliance and semantic HTML
- **High Contrast Mode**: Enhanced visibility for users with visual impairments
- **Keyboard Navigation**: Complete keyboard accessibility
- **Font Size Controls**: Adjustable text sizing for better readability
- **Reduced Motion**: Option to minimize animations and transitions

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development with comprehensive type definitions
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality, accessible component library
- **React Router DOM**: Client-side routing and navigation
- **React Query**: Server state management and data fetching

### Development Tools
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization
- **TypeScript**: Static type checking and IntelliSense

### Additional Libraries
- **@dnd-kit**: Drag and drop functionality
- **date-fns**: Date manipulation and formatting
- **react-day-picker**: Calendar component for date selection
- **lucide-react**: Beautiful and consistent icon library
- **sonner**: Toast notification system

## Project Structure

```
src/
├── components/
│   ├── accessibility/          # Accessibility components
│   ├── dashboard/             # Dashboard-specific components
│   ├── layout/                # Layout and navigation components
│   ├── modals/                # Modal and dialog components
│   └── ui/                    # Reusable UI components
├── contexts/                  # React context providers
├── data/                      # Mock data and data utilities
├── hooks/                     # Custom React hooks
├── lib/                       # Utility functions and helpers
├── pages/                     # Main application pages
└── types/                     # TypeScript type definitions
```

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/dark-horse-radar.git
cd dark-horse-radar
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## Pages and Features

### Dashboard
The main dashboard provides an overview of system status, key metrics, and quick access to essential functions. Features include:
- Real-time statistics and metrics
- Quick search and filtering
- System status indicators
- Recent activity feed

### Items Management
Comprehensive item tracking and management interface with advanced features:
- Item creation, editing, and deletion
- Advanced filtering and sorting
- Bulk operations
- Drag and drop reordering
- RFID tag management

### Smart Reminders
Intelligent reminder system for time-based and location-based notifications:
- Time-based reminders
- Event-based reminders
- Location-based reminders
- Custom notification settings

### Analytics
Data visualization and reporting capabilities:
- Interactive charts and graphs
- Performance metrics
- Trend analysis
- Export functionality

### Profile & Settings
User account management and application customization:
- Profile information management
- Accessibility settings
- Notification preferences
- Privacy controls
- Theme customization

## Design System

The application uses a comprehensive design system built on Tailwind CSS and shadcn/ui components:

### Color Palette
- **Primary**: Professional blue tones
- **Secondary**: Neutral grays and whites
- **Accent**: Highlight colors for important actions
- **Success/Error**: Clear status indicators

### Typography
- **Headings**: Clear hierarchy with consistent sizing
- **Body Text**: Readable fonts optimized for screen display
- **Code**: Monospace fonts for technical content

### Components
- **Buttons**: Consistent styling with clear states
- **Forms**: Accessible form controls with validation
- **Cards**: Content containers with subtle shadows
- **Modals**: Overlay dialogs for focused interactions

## Accessibility

Dark Horse Radar is built with accessibility as a core principle:

### Screen Reader Support
- Semantic HTML structure
- Comprehensive ARIA labels and descriptions
- Live region announcements for dynamic content
- Proper heading hierarchy

### Keyboard Navigation
- Full keyboard accessibility
- Logical tab order
- Focus indicators
- Keyboard shortcuts for common actions

### Visual Accessibility
- High contrast mode
- Adjustable font sizes
- Reduced motion support
- Clear visual hierarchy

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error handling

### Component Structure
- Keep components focused and single-purpose
- Use proper prop typing
- Implement accessibility features
- Add comprehensive documentation

### State Management
- Use React Query for server state
- Use local state for UI interactions
- Implement proper loading states
- Handle error states gracefully

## Contributing

We welcome contributions to improve Dark Horse Radar. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper testing
4. Ensure accessibility compliance
5. Submit a pull request with detailed description

### Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Run linting: `npm run lint`
4. Build for testing: `npm run build`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Review the documentation

## Roadmap

### Planned Features
- Real-time collaboration features
- Advanced data visualization
- Mobile application
- API integration
- Cloud synchronization
- Advanced security features

### Performance Optimizations
- Code splitting and lazy loading
- Virtual scrolling for large datasets
- Image optimization
- Caching strategies
- Bundle size optimization

---

**Dark Horse Radar** - Smart bag management for the modern world.
