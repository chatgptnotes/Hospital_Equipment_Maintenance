# Hospital Equipment Maintenance System

A modern, production-ready web application for managing hospital equipment maintenance, issue reporting, and technician workflows with real-time WhatsApp notifications.

## Features

- **Equipment Tracking**: Monitor 27+ pieces of equipment across multiple hospitals
- **Issue Reporting**: Staff can report equipment issues with photo uploads
- **WhatsApp Notifications**: Automatic alerts to service engineers
- **Technician Mode**: Dedicated interface for maintenance staff
- **Activity Logging**: Complete audit trail of all actions
- **Dual Filtering**: Filter by location and equipment category
- **Mobile Responsive**: Optimized for phones, tablets, and desktops
- **Modern UI**: Gradient-based design with smooth animations

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Deployment**: Vercel (recommended)

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hospital-maintenance-app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in the root directory:

```env
# Service Engineer WhatsApp Number
VITE_SERVICE_ENGINEER_PHONE=919370089063

# Application Version
VITE_APP_VERSION=1.0

# Hospital Names
VITE_HOSPITAL_1_NAME="Hope Hospital"
VITE_HOSPITAL_2_NAME="Ayushman Hospital"

# Feature Flags
VITE_ENABLE_WHATSAPP_NOTIFICATIONS=true
VITE_ENABLE_IMAGE_UPLOAD=true

# Deployment
VITE_DEPLOY_DATE=2025-12-12
```

## Available Commands

```bash
# Development
npm run dev          # Start development server

# Production Build
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically
```

## Usage

### Staff Mode (Default)

1. View all equipment with status indicators
2. Filter equipment by location and category
3. Report issues by clicking "Report Issue" button
4. Fill in issue details and upload photos
5. System automatically notifies service engineer via WhatsApp

### Technician Mode

1. Toggle to Technician Mode using the switch in header
2. View equipment needing repair
3. Click "Mark Resolved" to fix issues
4. Use "Log Monthly Maintenance" for routine checks
5. All actions are logged in Activity section

## Equipment Categories

- **ICU**: Critical care equipment
- **OT**: Operating theater equipment
- **Lab**: Laboratory equipment
- **Physiotherapy**: Rehabilitation equipment
- **Ward**: Patient ward equipment
- **General**: Infrastructure and utilities

## Team Members

The system includes a staff directory with:
- Clinical Team (Leads and RMOs)
- Operations Team
- Marketing Team
- Performance & Feedback Team
- HR & Training Team
- Service Engineers

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Manual Deployment

```bash
# Build the application
npm run build

# Deploy the 'dist' folder to your hosting provider
```

## Version Control

The application automatically tracks versions:
- Version format: `1.0`, `1.1`, `1.2`, etc.
- Increments with each Git push
- Displayed in footer with last update date

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security

- No sensitive data stored in frontend
- Environment variables for configuration
- WhatsApp URLs are properly encoded
- Image uploads converted to base64 (client-side only)

## FAQ

**Q: How do I change the service engineer's phone number?**
A: Update `VITE_SERVICE_ENGINEER_PHONE` in your `.env` file.

**Q: Can I add more hospitals?**
A: Yes, edit the location filter array in `src/App.jsx` and add equipment with the new location.

**Q: How do I add new equipment categories?**
A: Edit the category filter array in `src/App.jsx` and assign categories to equipment.

**Q: Does this require a backend?**
A: No, it's a client-side application. Data is stored in browser state (not persistent across refreshes).

**Q: How do I add persistence?**
A: Integrate with a backend API (Firebase, Supabase, or custom REST API) by modifying the state management hooks.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please contact the development team.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history and updates.
