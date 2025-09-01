# Warehouse Management System (WMS)

A comprehensive warehouse management system built with React, TypeScript, and Supabase for managing inventory, clients, and stock movements.

## Features

- **User Authentication**: Role-based access control (Admin/Agriculteur)
- **Dashboard**: Real-time statistics and recent movements overview
- **Client Management**: Complete client information and contact details
- **Stock Movements**: Track inventory in/out with detailed box counting
- **Comment System**: Communication between admins and farmers
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Custom CSS with CSS Variables
- **Charts**: Chart.js integration ready

## Prerequisites

- Node.js (v16 or higher)
- A Supabase account and project

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd warehouse-management-system
npm install
```

### 2. Supabase Configuration

1. Create a new project at [Supabase](https://supabase.com)
2. Copy your project URL and anon key from the API settings
3. Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

4. Update `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

The database schema is automatically created using Supabase migrations. The migration file includes:

- **clients** table: Customer information and contact details
- **users** table: System users with role-based permissions
- **stock_movements** table: Inventory transactions with detailed tracking
- Row Level Security (RLS) policies for data protection
- Automatic timestamp triggers

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## User Roles

### Admin
- Full access to all features
- Manage clients, users, and stock movements
- View all statistics and reports
- Read and respond to farmer comments

### Agriculteur (Farmer)
- View their own client's stock movements
- Add comments to movements
- Access dashboard with their specific statistics
- Limited to their assigned client data

## Database Schema

### Tables

- **clients**: Customer information (name, contact, type, etc.)
- **users**: System users linked to Supabase auth
- **stock_movements**: Inventory transactions with box counting

### Security

- Row Level Security (RLS) enabled on all tables
- Role-based access policies
- Secure authentication through Supabase Auth

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx   # Main dashboard view
│   ├── Header.tsx      # Application header
│   ├── LoginForm.tsx   # Authentication form
│   └── Sidebar.tsx     # Navigation sidebar
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── lib/                # Utilities and configurations
│   └── supabase.ts     # Supabase client and helpers
├── types/              # TypeScript type definitions
│   └── database.ts     # Database schema types
└── App.tsx             # Main application component
```

## Deployment

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

### Recommended Hosting

- **Vercel**: Automatic deployments with Git integration
- **Netlify**: Easy drag-and-drop deployment
- **Supabase Hosting**: Direct integration with your database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository or contact the development team.