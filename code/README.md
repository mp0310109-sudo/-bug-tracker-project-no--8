# Bug Tracker - Production-Ready Issue Tracking Application

A modern, full-stack bug tracking and issue management application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a stunning, animated UI with glassmorphism effects and vibrant color gradients.

## 🚀 Features

### Core Functionality
- **User Authentication** - JWT-based authentication with access & refresh tokens
- **Project Management** - Create, update, and delete projects
- **Team Collaboration** - Invite team members with role-based access
- **Issue Tracking** - Create, assign, and track tickets/issues
- **Kanban Board** - Drag-and-drop interface for ticket management
- **Threaded Comments** - Comment system with replies and mentions
- **File Attachments** - Upload screenshots and documents
- **Advanced Filtering** - Search and filter tickets by status, priority, assignee

### User Roles
- **Admin** - Full system access
- **Manager** - Project management and team oversight
- **Developer** - Ticket creation and updates
- **Viewer** - Read-only access

### UI/UX
- **Modern SaaS-inspired design** (Linear/Jira style)
- **Dark mode with glassmorphism effects**
- **Vibrant color gradients** (Purple, Cyan, Emerald, Amber)
- **Smooth animations with Framer Motion**
- **Fully responsive (mobile-first)**
- **Real-time toast notifications**
- **Animated background elements**
- **Floating particles and glow effects**

## 🎨 Design System

### Color Palette
- **Primary**: Indigo/Purple gradient (#6366f1 to #8b5cf6)
- **Accent**: Electric Blue (#06b6d4)
- **Success**: Emerald (#10b981)
- **Warning**: Amber (#f59e0b)
- **Danger**: Rose (#f43f5e)
- **Background**: Deep slate gradients (#0f172a to #1e293b)

### Animations
- **Fade In Up/Down** - Smooth page transitions
- **Scale In** - Modal and card appearances
- **Float** - Background element animations
- **Glow** - Interactive hover effects
- **Shimmer** - Loading states
- **Gradient Shift** - Animated borders

### Components
- **Glass Cards** - Frosted glass effect with backdrop blur
- **Gradient Buttons** - Multi-color gradient backgrounds
- **Enhanced Inputs** - Focus states with glow effects
- **Animated Badges** - Priority and status indicators
- **Avatar System** - Gradient backgrounds with initials

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Validation**: Express Validator

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom CSS variables
- **Animations**: Framer Motion
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Drag & Drop**: @hello-pangea/dnd
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Project Structure

```
bug-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # Supabase connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── projectController.js  # Project CRUD operations
│   │   ├── ticketController.js   # Ticket management
│   │   └── commentController.js  # Comment system
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── error.js              # Error handling
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Project.js            # Project schema
│   │   ├── Ticket.js             # Ticket schema
│   │   └── Comment.js            # Comment schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── projects.js           # Project routes
│   │   ├── tickets.js            # Ticket routes
│   │   └── comments.js           # Comment routes
│   ├── uploads/                  # File uploads directory
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── api.js            # Axios configuration
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Layout.jsx    # Main layout with sidebar
│   │   │   └── ui/               # Reusable UI components
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Modal.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── Badge.jsx
│   │   │       ├── Avatar.jsx
│   │   │       ├── Select.jsx
│   │   │       └── Textarea.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Authentication context
│   │   ├── pages/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.jsx
│   │   │   └── Project/
│   │   │       ├── Projects.jsx  # Projects list
│   │   │       └── Project.jsx   # Single project with Kanban
│   │   ├── App.jsx               # Main app with routing
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles with animations
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Supabase account and project
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd bug-tracker
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Environment Variables**

Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000

# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Client URL
CLIENT_URL=http://localhost:5173
```

5. **Database Setup**

Create the following tables in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'developer' CHECK (role IN ('admin', 'manager', 'developer', 'viewer')),
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project members table
CREATE TABLE project_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'developer' CHECK (role IN ('admin', 'manager', 'developer', 'viewer')),
  UNIQUE(project_id, user_id)
);

-- Tickets table
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT DEFAULT 'Todo' CHECK (status IN ('Todo', 'InProgress', 'Done')),
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);
CREATE INDEX idx_tickets_project_id ON tickets(project_id);
CREATE INDEX idx_tickets_assignee_id ON tickets(assignee_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_comments_ticket_id ON comments(ticket_id);
CREATE INDEX idx_comments_parent_comment_id ON comments(parent_comment_id);
```

6. **Start the Application**

Backend:
```bash
cd backend
npm run dev
```

Frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/users` - Get all users (admin/manager only)

### Project Endpoints
- `GET /api/projects` - Get user's projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add team member
- `DELETE /api/projects/:id/members/:userId` - Remove team member

### Ticket Endpoints
- `GET /api/tickets/project/:projectId` - Get project tickets
- `GET /api/tickets/:id` - Get single ticket
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket
- `DELETE /api/tickets/:id` - Delete ticket
- `PUT /api/tickets/:id/status` - Update ticket status
- `PUT /api/tickets/bulk-order` - Bulk update ticket order
- `POST /api/tickets/:id/attachments` - Upload attachment
- `GET /api/tickets/stats/dashboard` - Get dashboard statistics

### Comment Endpoints
- `GET /api/comments/ticket/:ticketId` - Get ticket comments
- `POST /api/comments` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies for tokens
- Rate limiting to prevent abuse
- CORS configuration
- Helmet for secure headers
- Input validation and sanitization
- Role-based access control

## 🎨 UI Components

The application includes a comprehensive set of reusable UI components:

- **Button** - Multiple variants with gradient backgrounds and animations
- **Input** - Form inputs with focus glow effects
- **Textarea** - Multi-line text inputs with animations
- **Select** - Dropdown selects with custom styling
- **Modal** - Animated modal dialogs with glassmorphism
- **Card** - Content containers with hover effects
- **Badge** - Status and priority indicators with gradients
- **Avatar** - User avatars with gradient backgrounds

## 📱 Responsive Design

The application is fully responsive with:
- Collapsible sidebar navigation
- Mobile-friendly touch interactions
- Adaptive layouts for all screen sizes
- Optimized Kanban board for mobile

## 🚀 Deployment

### Backend (Render/Railway)
1. Set environment variables
2. Connect to Supabase
3. Deploy with `npm start`

### Frontend (Vercel/Netlify)
1. Build command: `npm run build`
2. Output directory: `dist`
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ using the MERN stack

---

**Note**: This is a production-ready application with a modern, animated UI featuring glassmorphism effects, vibrant color gradients, and smooth animations. Make sure to:
- Change default JWT secrets in production
- Set up proper Supabase connection
- Configure CORS for your production domain
- Set up proper file storage (S3, Cloudinary) for attachments