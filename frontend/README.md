# EMP-Tracker Frontend

## Overview
Modern React frontend with professional UI/UX, role-based dashboards, and advanced analytics for the EMP-Tracker employee management system.

## Tech Stack
- **Framework**: React 19.0.0
- **Routing**: React Router DOM 7.0.2
- **HTTP Client**: Axios 1.7.9
- **UI Library**: Bootstrap 5.3.3
- **Charts**: Recharts 3.10.1
- **Notifications**: React Toastify 10.0.6
- **Icons**: React Icons 5.4.0
- **State Management**: React Context API

## Features
- Unified login with role selection
- Admin dashboard with full management capabilities
- HR dashboard with employee oversight
- Employee personal dashboard
- Advanced analytics dashboard
- Professional UI with gradients and animations
- Responsive design
- Real-time notifications

## Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

The frontend will start on `http://localhost:3000`

### Production Build
```bash
npm run build
```

### Testing
```bash
npm test
```

## Project Structure
```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── UnifiedLogin.js
│   │   ├── AdminDashboard.js
│   │   ├── HRDashboard.js
│   │   ├── EmployeeDashboard.js
│   │   ├── AnalyticsDashboard.js
│   │   └── ...
│   ├── context/            # React Context (Auth)
│   ├── styles/              # CSS styles
│   └── api/                # API service layer
├── public/                 # Static assets
└── package.json
```

## Available Scripts
- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## API Configuration
The frontend communicates with the backend at `http://localhost:8081`

## Features by Role

### Admin
- Full system management
- Employee CRUD operations
- Task assignment
- Leave approval
- Advanced analytics
- Tenant management

### HR
- Employee management
- Task assignment
- Leave approval
- Attendance viewing
- Analytics dashboard

### Employee
- Personal dashboard
- Task viewing
- Leave requests
- Attendance tracking
- Profile management
