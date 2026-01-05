# Fleet Management Dashboard

A professional fleet management system built with React, Vite, Redux Toolkit, and shadcn/ui.

## Features

- **Authentication**: JWT-based login and registration system
- **Role-based Access Control**: Admin and Chauffeur roles with different permissions
- **Fleet Management**: Manage trucks, trailers, and tires
- **Driver Management**: Track driver information and licenses
- **Trip Management**: Create, track, and complete trips
- **Fuel Records**: Monitor fuel consumption and costs
- **Maintenance**: Manage maintenance rules and records
- **Alerts System**: Track and resolve fleet alerts
- **Mission Orders**: Generate PDF mission order documents
- **Responsive Design**: Modern, enterprise-grade UI with dark/light theme support

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **shadcn/ui** - UI component library
- **Tailwind CSS v4** - Styling
- **Lucide Icons** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the API URL in `.env`:

```
VITE_API_URL=http://localhost:8000/api
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── forms/          # Form components
│   ├── ui/             # shadcn/ui components
│   └── ...
├── hooks/              # Custom React hooks
├── layouts/            # Layout components
├── pages/              # Page components
├── services/           # API services
│   └── api/           # Axios service modules
├── state/              # Redux state management
│   └── redux/
│       ├── slices/    # Redux slices
│       └── store.js   # Redux store
├── utils/              # Utility functions
├── App.jsx             # Main app component
├── main.jsx            # App entry point
└── index.css           # Global styles
```

## Architecture

### State Management

- **Redux Toolkit** for global state management
- **No React Context** - all global state handled via Redux
- Separate slices for each domain (trucks, trips, auth, etc.)

### Forms

- **Modular and reusable** form system
- Schema-driven field configuration
- Form validation and error handling
- Drawer-based form UI (side panels)

### Authentication

- JWT token-based authentication
- Access and refresh token support
- Token stored in localStorage
- Automatic token refresh on expiration

### Role-based Access

- Admin: Full access to all features
- Chauffeur: Limited access (trips, fuel, mission orders)
- Custom hooks for permission checking

## API Integration

The application expects a REST API with the following endpoints:

- `/auth/*` - Authentication endpoints
- `/trucks/*` - Truck management
- `/trailers/*` - Trailer management
- `/tires/*` - Tire management
- `/drivers/*` - Driver management
- `/trips/*` - Trip management
- `/fuel-records/*` - Fuel record management
- `/maintenance/*` - Maintenance management
- `/alerts/*` - Alert management
- `/mission-orders/*` - Mission order generation

All API requests include:
- Bearer token authentication
- Automatic token refresh
- Error handling

## User Roles

### Admin
- Full CRUD access to all resources
- Driver management
- Maintenance rules and records
- Alert resolution

### Chauffeur
- View trucks, trailers, tires
- Create and manage trips
- Add fuel records
- Generate mission orders
- View alerts

## License

Private - All rights reserved
