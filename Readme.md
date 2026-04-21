# WasteZero - Environmental Impact Management Platform

[![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat&logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38b2ac?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8.1-010101?style=flat&logo=socket.io)](https://socket.io/)

WasteZero is a comprehensive environmental impact management platform that connects volunteers with NGOs and waste management organizations to facilitate environmental cleanup initiatives, recycling programs, and community engagement activities. The platform features real-time communication, advanced analytics, user blocking capabilities, and comprehensive admin controls.

## 🌟 Key Features

### Multi-Role Dashboard System
- **Admin Dashboard**: 
  - Complete platform oversight with user management and analytics
  - User blocking/unblocking functionality with reason tracking
  - Real-time platform insights and activity monitoring
  - Waste collection trend analysis with interactive charts
  - User distribution statistics (NGOs vs Volunteers)
  - System health monitoring and uptime tracking
  - Export functionality for comprehensive reports
  
- **NGO Dashboard**: 
  - Event creation with rich text descriptions and image uploads
  - Volunteer management and application review system
  - Impact tracking with waste collection metrics
  - Attendance management for events
  - Performance analytics and engagement insights
  
- **Volunteer Dashboard**: 
  - Personalized opportunity browsing with skill matching
  - Application management with status tracking
  - Participation history and impact contributions
  - Preference settings for opportunity recommendations
  - Achievement tracking and volunteer statistics

### Advanced User Management & Security
- **User Blocking System**: 
  - Admin-controlled user blocking/unblocking
  - Mandatory reason tracking for blocked users
  - Real-time blocked user detection and session termination
  - BlockedUserContext for global state management
  - Automatic redirect to blocked user screen
  - Secure middleware validation on all protected routes

- **Enhanced Authentication**:
  - JWT-based token authentication with secure refresh
  - OTP-based email verification for password reset
  - Professional HTML email templates with branding
  - Customizable email variants (verification, password reset, email change)
  - Email validation with proper regex patterns
  - Password strength requirements (minimum 6 characters)
  - Protected routes with role-based access control
  - Session management with automatic cleanup
  - Nodemailer integration with Gmail service

### Real-Time Communication System
- **Role-Based Messaging**: 
  - Structured communication channels between user types:
    - NGOs ↔ Volunteers: Coordinate environmental activities
    - Admins ↔ All Users: Platform oversight and support
    - Cross-role restrictions prevent unauthorized communications
  - Role validation on both send and receive operations
  
- **Socket.IO Integration**: 
  - Real-time bidirectional messaging with live updates
  - Online/offline user status indicators
  - Typing indicators for active conversations
  - Message delivery confirmation
  
- **Message Features**:
  - Conversation history stored in MongoDB
  - Unread message indicators with count badges
  - User role display in chat interface
  - Message search and filtering
  - Conversation management (delete, archive)

### Advanced Event Management
- **Comprehensive Event System**:
  - Rich event creation with Markdown support
  - Multi-image upload with base64 encoding (25MB limit)
  - Skill requirement matching with volunteer profiles
  - Detailed location and contact information
  - Event categories: Cleanup, Tree Plantation, Recycling, Education, etc.
  
- **Application Workflow**:
  - Complete volunteer application with personalized messages
  - Multi-status tracking: pending, accepted, rejected, attended
  - Bulk application management for NGOs
  - Application history and analytics
  
- **Event Status Management**:
  - Real-time status updates (active, inactive, completed, cancelled)
  - Automatic capacity tracking (registered vs. total slots)
  - Progress indicators for event completion
  - Event rescheduling and cancellation capabilities

### Professional Analytics & Reporting
- **Admin Analytics**:
  - Platform-wide statistics dashboard
  - User growth tracking with trend analysis
  - Waste collection metrics by period (Week/Month/Year)
  - Interactive charts using Recharts library
  - Export functionality for detailed reports
  - System performance monitoring
  
- **NGO Analytics**:
  - Event performance metrics
  - Volunteer engagement statistics
  - Impact tracking (waste collected, trees planted, etc.)
  - Attendance and participation rates
  
- **Volunteer Analytics**:
  - Personal impact contributions
  - Participation history visualization
  - Skills utilization tracking
  - Achievement milestones

### Enhanced User Experience
- **Dark Mode Support**: 
  - System-wide dark theme with ThemeContext
  - Automatic theme persistence in localStorage
  - Smooth transitions between themes
  - Optimized color schemes for accessibility
  - Toggle switch in Settings page
  
- **Settings & Preferences**:
  - Dedicated SettingsPage for user preferences
  - Dark/Light mode toggle with visual feedback
  - Password change functionality with validation
  - Account security management
  - Notification preferences
  - Privacy settings
  
- **Responsive Design**: 
  - Mobile-first approach with Tailwind CSS
  - Adaptive layouts for all screen sizes
  - Touch-optimized interactions for mobile
  - Hamburger menu for mobile navigation
  
- **Advanced UI Components**:
  - Modal systems for details, confirmations, and image viewing
  - Image enlargement functionality with zoom
  - Toast notifications (React Hot Toast & Toastify)
  - Loading skeletons and spinners
  - Professional card designs with animations
  - Progress bars and status indicators

### Notification System
- **Real-Time Notifications**:
  - In-app notification center with NotificationContext
  - Application status updates
  - Event reminders and updates
  - Admin announcements
  - Unread notification badges with real-time count
  - Mark as read/unread functionality
  - Notification filtering by type
  - Pagination support for notification history
  - Auto-refresh and live updates
  - Batch operations (mark all as read, delete all)

### Attendance Management
- **Event Attendance Tracking**:
  - Check-in/check-out system for events
  - QR code-based attendance (optional)
  - Manual attendance marking by NGOs
  - Attendance reports and analytics
  - Volunteer participation verification

### Smart Matching System
- **Intelligent Volunteer-Opportunity Matching**:
  - Algorithm-based matching with multi-factor scoring
  - Skills compatibility analysis with weighted matching
  - Geographic proximity calculation using Haversine formula
  - Waste type preference matching
  - Experience level compatibility scoring
  - Time availability and scheduling analysis
  - Personalized match scores (0-100) for each opportunity
  - Automatic volunteer recommendations for NGOs
  - Preference-based filtering and ranking
  
- **Matching Features**:
  - Real-time match calculation on user preferences
  - Distance-based filtering (radius in kilometers)
  - Multi-criteria scoring algorithm
  - Volunteer invitation system for NGOs
  - Match history and analytics
  - Preference learning and adaptation

## 🚀 Technology Stack

### Frontend
- **React 19.1.1**: Modern React with hooks and functional components
- **Vite 5.4.2**: Lightning-fast build tool and development server
- **React Router DOM 6.26.1**: Client-side routing with protected routes
- **Tailwind CSS 3.4.10**: Utility-first CSS framework with custom theme
- **Socket.IO Client 4.8.1**: Real-time bidirectional communication
- **Framer Motion 12.23.12**: Smooth animations and page transitions
- **Recharts 2.15.0**: Interactive and responsive charts for analytics
- **React Hot Toast 2.4.1**: Modern toast notification system
- **React Toastify**: Additional toast notification library
- **Lucide React 0.468.0**: Modern, customizable icon library
- **Axios 1.7.9**: Promise-based HTTP client
- **React Context API**: Global state management for user, theme, and blocked state

### Backend
- **Node.js 20+**: JavaScript runtime environment
- **Express.js 5.1.0**: Minimalist web application framework
- **MongoDB**: NoSQL database with flexible schema design
- **Mongoose 8.18.1**: MongoDB ODM with schema validation
- **Socket.IO 4.8.1**: Real-time communication server
- **JWT (jsonwebtoken 9.0.2)**: Secure token-based authentication
- **bcryptjs 2.4.3**: Password hashing and security
- **Nodemailer 7.0.6**: Email service for OTP delivery
- **CORS 2.8.5**: Cross-origin resource sharing middleware
- **cookie-parser 1.4.7**: Parse cookies in requests
- **dotenv 16.4.7**: Environment variable management

### Development Tools
- **Nodemon 3.1.9**: Auto-restart server on file changes
- **ESLint 9.15.0**: Code linting and quality assurance
- **PostCSS 8.4.41**: CSS processing and autoprefixing
- **Autoprefixer 10.4.20**: Vendor prefix automation
- **Vitest**: Unit testing framework (configured)

## 📁 Enhanced Project Structure

```
WasteZero_Infosys_Internship_Aug2025_Team_01/
├── backend/
│   ├── src/
│   │   └── server.js                    # Main server entry with Socket.IO
│   ├── controllers/                     # API route handlers
│   │   ├── auth.controller.js           # Authentication & registration
│   │   ├── admin.controller.js          # Admin user management & blocking
│   │   ├── matching.controller.js       # Smart matching algorithm
│   │   ├── message.controller.js        # Real-time messaging logic
│   │   ├── ngo.controller.js            # NGO event management
│   │   ├── user.controller.js           # User profile operations
│   │   ├── volunteer.controller.js      # Volunteer operations
│   │   ├── notification.controller.js   # Notification system
│   │   └── reset.controller.js          # Password reset with OTP
│   ├── models/                          # Mongoose schemas
│   │   ├── user.model.js                # User schema with blocking fields
│   │   ├── opportunity.model.js         # Event/opportunity schema
│   │   ├── application.model.js         # Volunteer application schema
│   │   ├── conversation.model.js        # Chat conversation schema
│   │   ├── message.model.js             # Message schema
│   │   └── notification.model.js        # Notification schema
│   ├── routes/                          # API route definitions
│   │   ├── auth.routes.js               # Authentication routes
│   │   ├── admin.routes.js              # Admin-only routes
│   │   ├── matching.routes.js           # Matching algorithm routes
│   │   ├── user.routes.js               # User management routes
│   │   ├── ngo.routes.js                # NGO-specific routes
│   │   ├── volunteer.routes.js          # Volunteer routes
│   │   ├── message.routes.js            # Messaging routes
│   │   ├── notification.routes.js       # Notification routes
│   │   └── reset.routes.js              # Password reset routes (legacy)
│   ├── middleware/                      # Custom middleware
│   │   └── protectRoute.js              # JWT auth & blocked user check
│   ├── services/                        # Business logic services
│   │   └── matchingService.js           # Smart matching algorithm implementation
│   ├── socket/                          # Socket.IO configuration
│   │   └── socket.js                    # Real-time event handlers
│   ├── utils/                           # Utility functions
│   │   └── mailer.js                    # Email service with templates
│   ├── lib/                             # Utility libraries
│   │   └── connectDb.js                 # MongoDB connection
│   ├── create-test-users.js             # Test data generation script
│   ├── fix-db-indexes.js                # Database index maintenance script
│   └── .env                             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/                       # Main application pages
│   │   │   ├── Homepage.jsx             # Public landing page
│   │   │   ├── AuthPage.jsx             # Login/Registration with OTP
│   │   │   ├── Forgot_Password.jsx      # Password reset flow
│   │   │   ├── AdminDashboard.jsx       # Admin control panel
│   │   │   ├── NGODashboard.jsx         # NGO management interface
│   │   │   ├── VolunteerDashboard.jsx   # Volunteer portal
│   │   │   ├── MessagePage.jsx          # Real-time chat interface
│   │   │   ├── MyProfile.jsx            # User profile management
│   │   │   ├── NotificationsPage.jsx    # Notification center
│   │   │   ├── AnalyticDashboard.jsx    # Advanced analytics
│   │   │   ├── AttendanceManager.jsx    # Event attendance tracking
│   │   │   ├── SettingsPage.jsx         # User settings & preferences
│   │   │   └── NotFoundPage.jsx         # 404 error page
│   │   ├── components/                  # Reusable UI components
│   │   │   ├── Navbar.jsx               # Main navigation header
│   │   │   ├── Side.jsx                 # Sidebar navigation
│   │   │   ├── OpportunityCard.jsx      # Event display cards
│   │   │   ├── BlockedUserScreen.jsx    # Blocked user notification
│   │   │   ├── StatCard.jsx             # Dashboard statistics cards
│   │   │   ├── MatchedOpportunities.jsx # Personalized recommendations
│   │   │   ├── RecommendedVolunteers.jsx# Volunteer matching
│   │   │   ├── UpcomingPickups.jsx      # Scheduled events
│   │   │   ├── RecentNotifications.jsx  # Notification widget
│   │   │   ├── VolunteerPreferences.jsx # Preference settings
│   │   │   └── AppFooter.jsx            # Application footer
│   │   ├── contexts/                    # React Context providers
│   │   │   ├── UserContext.jsx          # Global user state
│   │   │   ├── ThemeContext.jsx         # Dark mode state
│   │   │   ├── BlockedUserContext.jsx   # Blocked user state
│   │   │   └── NotificationContext.jsx  # Notification state management
│   │   ├── services/                    # API communication
│   │   │   └── api.js                   # Axios instance & interceptors
│   │   ├── constants/                   # Application constants
│   │   │   └── DummyData.jsx            # Sample data for development
│   │   ├── App.jsx                      # Main app component with routing
│   │   └── main.jsx                     # React app entry point
│   ├── public/                          # Static assets
│   └── tailwind.config.js               # Tailwind custom configuration
├── defect sheet/                        # Bug tracking documentation
├── testing/                             # Test suites and utilities
└── README.md                            # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (version 18 or higher recommended)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** for version control
- **npm** or **yarn** package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd WasteZero_Infosys_Internship_Aug2025_Team_01/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/wastezero
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wastezero
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   
   # Server Configuration
   PORT=4000
   NODE_ENV=development
   
   # Frontend URL (for CORS)
   CLIENT_URL=http://localhost:5173
   
   # Email Configuration (for OTP - Gmail example)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_specific_password
   # For Gmail, enable 2FA and create an app-specific password
   
   # Socket.IO Configuration
   SOCKET_PORT=4000
   ```

4. **Create test users (optional)**
   ```bash
   node create-test-users.js
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The backend server will start at `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration (optional)**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:4000
   VITE_SOCKET_URL=http://localhost:4000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend application will start at `http://localhost:5173`

## 🔑 API Endpoints

### Authentication
```
POST   /api/auth/register          # User registration (volunteer/ngo/admin)
POST   /api/auth/login             # User login with JWT token
POST   /api/auth/logout            # User logout (clear cookies)
GET    /api/auth/check             # Check authentication status
POST   /api/reset/send-otp         # Send OTP for password reset
POST   /api/reset/verify-otp       # Verify OTP code
POST   /api/reset/reset-password   # Reset password after OTP verification
```

### Admin Routes (Protected - Admin Only)
```
GET    /api/admin/users            # Get all users with pagination & filters
PUT    /api/admin/users/:id/block  # Block/unblock user with reason
GET    /api/admin/analytics        # Get platform analytics
GET    /api/admin/dashboard-stats  # Get dashboard statistics
```

### User Management
```
GET    /api/user/profile           # Get current user profile
PUT    /api/user/profile           # Update user profile
POST   /api/user/upload-photo      # Upload profile photo
GET    /api/users                  # Get users for messaging (role-filtered)
GET    /api/user/:id               # Get specific user details
```

### Events & Opportunities (NGO)
```
GET    /api/ngo/events             # Get NGO's events
POST   /api/ngo/create-event       # Create new event
PUT    /api/ngo/events/:id         # Update event details
DELETE /api/ngo/events/:id         # Delete/cancel event
GET    /api/ngo/applications       # Get event applications
PUT    /api/ngo/applications/:id   # Update application status
POST   /api/ngo/mark-attendance    # Mark volunteer attendance
```

### Volunteer Operations
```
GET    /api/volunteer/opportunities        # Browse available opportunities
GET    /api/volunteer/opportunities/:id    # Get opportunity details
POST   /api/volunteer/apply/:id            # Apply for opportunity
GET    /api/volunteer/applications         # Get user's applications
PUT    /api/volunteer/preferences          # Update volunteer preferences
GET    /api/volunteer/recommended          # Get personalized recommendations
GET    /api/volunteer/statistics           # Get volunteer stats & impact
```

### Messaging (Role-Based Access Control)
```
GET    /api/messages/conversations  # Get user's conversations
GET    /api/messages/:id            # Get messages in conversation (role-validated)
POST   /api/messages/send/:id       # Send message (role-validated)
DELETE /api/messages/:id            # Delete conversation
PUT    /api/messages/:id/read       # Mark messages as read
```

#### Role-Based Communication Rules
- **NGO Users**: Can message Volunteers and Admins
- **Volunteer Users**: Can message NGOs and Admins  
- **Admin Users**: Can message all user types
- **Cross-validation**: Both send and receive operations validate role compatibility
- **Middleware Check**: `protectRoute` validates blocked users before message access

### Notifications
```
GET    /api/notifications           # Get user notifications
PUT    /api/notifications/:id/read  # Mark notification as read
DELETE /api/notifications/:id       # Delete notification
POST   /api/notifications/mark-all-read # Mark all as read
```

### Smart Matching System
```
GET    /api/matching/opportunities          # Get matched opportunities for volunteer
GET    /api/matching/volunteers/:opportunityId  # Get matched volunteers for opportunity (NGO)
PUT    /api/matching/preferences            # Update volunteer matching preferences
POST   /api/matching/invite                 # Invite volunteer to opportunity (NGO)
```

## 👥 User Roles & Permissions

### Admin
**Full Platform Control:**
- ✅ User management (view, block, unblock)
- ✅ Access to all analytics and reports
- ✅ System configuration and settings
- ✅ Message all user types
- ✅ Event oversight and moderation
- ✅ Platform-wide announcements
- ✅ Export comprehensive reports

**Blocked User Management:**
- Block users with mandatory reason tracking
- Unblock users and restore access
- View block history and reasons
- Real-time user session termination

### NGO (Non-Governmental Organization)
**Event & Volunteer Management:**
- ✅ Create and manage environmental events
- ✅ Upload event images and detailed descriptions
- ✅ Set skill requirements and volunteer capacity
- ✅ Review and approve/reject volunteer applications
- ✅ Track volunteer attendance and participation
- ✅ Access event-specific analytics
- ✅ Message volunteers and admins
- ✅ Export event reports

**Impact Tracking:**
- View waste collection metrics
- Track volunteer contributions
- Monitor event completion rates
- Generate impact reports

### Volunteer
**Opportunity Discovery & Participation:**
- ✅ Browse opportunities by category, location, and skills
- ✅ View detailed event information and requirements
- ✅ Apply for events with personalized messages
- ✅ Track application status in real-time
- ✅ View participation history and impact
- ✅ Message NGOs and admins
- ✅ Set preferences for recommendations

**Personal Dashboard:**
- View personalized opportunity matches
- Track personal environmental impact
- Manage application history
- View upcoming events and reminders
- Access achievement milestones

## 🎨 UI/UX Features

### Professional Design System
**Color Palette:**
- **Primary Colors**:
  - Forest Green (#344e41, #588157, #4f685b)
  - Emerald Accents (#10b981, #059669, #047857)
  - Sage Tones (#a3b18a, #dad7cd)
  
- **Background Colors**:
  - Light Mode: Cream (#f5f5dc), Beige (#e5e5dc)
  - Dark Mode: Gray variants (#1f2937, #111827, #030712)
  
- **Utility Colors**:
  - Success: Green (#22c55e)
  - Warning: Amber (#f59e0b)
  - Error: Red (#ef4444)
  - Info: Blue (#3b82f6)

**Typography System:**
- **Font Family**: Inter, System UI, -apple-system, sans-serif
- **Headings**: Bold weights (700-800) with tight letter spacing
- **Body**: Regular (400) and Medium (500) weights
- **Special**: Poppins for hero sections and service headings

### Advanced UI Components

**Interactive Elements:**
- ✨ Smooth hover effects and transitions
- ✨ Loading states with skeleton screens
- ✨ Professional card designs with gradients
- ✨ Modal systems for various interactions
- ✨ Toast notifications for user feedback
- ✨ Progress bars and status indicators
- ✨ Badge systems for notifications and status

**Responsive Design:**
- 📱 Mobile-first approach (320px+)
- 💻 Tablet optimization (768px+)
- 🖥️ Desktop enhancements (1024px+)
- 📺 Large screen support (1440px+)
- Touch-optimized interactions
- Adaptive navigation (hamburger on mobile)

**Accessibility Features:**
- ♿ Proper ARIA labels and roles
- ⌨️ Keyboard navigation support
- 🎨 High contrast color schemes
- 📖 Screen reader compatibility
- 🔍 Focus indicators for interactive elements
- 🌓 Dark mode for reduced eye strain

### Image Management
- **Profile Photos**: Upload, preview, and crop functionality
- **Event Images**: Multi-image support with galleries
- **Image Enlargement**: Modal viewing with zoom capabilities
- **Size Limits**: 25MB maximum with compression
- **Format Support**: JPEG, PNG, GIF, WebP

## � Smart Matching Algorithm

WasteZero features a sophisticated rule-based matching system that intelligently connects volunteers with opportunities and helps NGOs find the most suitable volunteers for their events using mathematical scoring algorithms.

### How It Works

The matching system uses a **multi-criteria scoring algorithm** (not AI/ML) that evaluates compatibility based on multiple weighted factors. Each factor is calculated using mathematical formulas and business logic rules.

### Matching Algorithm Components

#### **1. Skills Compatibility Scoring**
- Analyzes volunteer skills against opportunity requirements
- Uses fuzzy matching to find related skills
- Calculates weighted scores based on skill overlap
- Prioritizes critical vs. optional skills

#### **2. Geographic Proximity Analysis**
- Uses Haversine formula to calculate accurate distances
- Converts addresses to latitude/longitude coordinates
- Filters opportunities within specified radius
- Provides distance-based scoring (closer = higher score)

#### **3. Waste Type Preference Matching**
- Matches volunteer waste type preferences with opportunity types
- Supports multiple waste categories: Organic, Plastic, E-waste, Paper, Metal, Glass
- Calculates compatibility percentage
- Neutral scoring for volunteers without strong preferences

#### **4. Experience Level Compatibility**
- Three-tier system: Beginner, Intermediate, Advanced
- Ensures volunteer experience meets minimum requirements
- Partial credit for ambitious beginners
- Perfect matches for overqualified volunteers

#### **5. Time Availability Analysis**
- Matches volunteer availability with event schedules
- Considers day of week preferences
- Time preference matching (morning, afternoon, evening, flexible)
- Partial credit for flexible schedules

#### **6. Historical Performance**
- Tracks volunteer participation history
- Attendance reliability scoring
- Past application success rate
- Engagement patterns and commitment level

### Matching Score Calculation

The final match score (0-100) is calculated using weighted factors:

```javascript
Match Score = (
  Skills Score × 30% +
  Distance Score × 25% +
  Waste Type Score × 20% +
  Experience Score × 15% +
  Time Availability × 10%
)
```

### Matching Features for Different Roles

**For Volunteers:**
- Get personalized opportunity recommendations
- See match scores for each opportunity
- Filter by minimum match percentage
- Update preferences to improve matches

**For NGOs:**
- View matched volunteers for each event
- Invite high-match volunteers directly
- See detailed matching breakdown
- Access volunteer compatibility reports

### Algorithm Optimization
- Real-time calculation on preference updates
- Efficient database queries with indexed fields
- Caching for frequently accessed matches
- Configurable weights for different matching factors

## 🔧 Development Guidelines

### Code Standards
- **JavaScript**: ES6+ features with async/await
- **React**: Functional components with hooks
- **Naming**: camelCase for variables, PascalCase for components
- **File Structure**: Feature-based organization
- **Comments**: JSDoc style for functions
- **Error Handling**: Try-catch blocks with meaningful messages

### Performance Optimizations
- **Code Splitting**: React.lazy() for route-based splitting
- **Image Optimization**: Base64 encoding with size limits
- **Lazy Loading**: Images and components loaded on demand
- **Memoization**: useMemo and useCallback for expensive operations
- **Socket Optimization**: Event debouncing and throttling
- **Database Indexing**: Mongoose indexes on frequently queried fields

### Security Best Practices
- ✅ JWT token validation on all protected routes
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Input validation and sanitization
- ✅ CORS configuration for allowed origins
- ✅ Rate limiting on authentication endpoints
- ✅ Blocked user middleware on all API routes
- ✅ XSS protection with proper escaping
- ✅ CSRF tokens for state-changing operations

## 🚀 Deployment

### Production Build

**Backend Production:**
```bash
cd backend
npm install --production
npm start
```

**Frontend Production:**
```bash
cd frontend
npm run build
npm run preview
```

### Environment Variables for Production
```env
# Backend .env (Production)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/wastezero
JWT_SECRET=ultra_secure_random_string_min_32_chars
PORT=4000
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=production_email_password
```

### Deployment Platforms

**Recommended Hosting:**
- **Backend**: Heroku, Railway, Render, AWS EC2
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Database**: MongoDB Atlas (free tier available)
- **Images**: Cloudinary, AWS S3 (optional)

**Deployment Checklist:**
- [ ] Set all environment variables
- [ ] Configure MongoDB Atlas IP whitelist
- [ ] Enable CORS for production domain
- [ ] Set up SSL certificates
- [ ] Configure WebSocket connections
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Configure CDN for static assets
- [ ] Set up automated backups
- [ ] Implement rate limiting
- [ ] Configure logging and monitoring

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Test Coverage
- Unit tests for controllers and models
- Integration tests for API endpoints
- Component tests for React components
- E2E tests for critical user flows

### Test Utilities & Scripts
- `create-test-users.js`: Generate sample users for testing
- `test-imports.js`: Verify module imports
- `fix-db-indexes.js`: Fix MongoDB index issues and clean invalid data
- Testing documentation in `testing/` directory
- Defect tracking sheet in `defect sheet/` directory

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (admin/ngo/volunteer),
  isBlocked: Boolean,
  blockReason: String,
  profilePhoto: String (base64),
  location: String,
  coordinates: { lat: Number, lng: Number }, // For matching algorithm
  skills: [String],
  wasteTypePreferences: [String], // For matching
  experienceLevel: String, // beginner/intermediate/advanced
  availability: { 
    days: [String], 
    timePreference: String 
  },
  bio: String,
  createdAt: Date,
  otp: String,
  otpExpires: Date
}
```

### Opportunity Model
```javascript
{
  title: String,
  description: String,
  category: String,
  location: String,
  coordinates: { lat: Number, lng: Number }, // For distance calculation
  wasteTypes: [String], // For matching
  date: Date,
  timePreference: String, // morning/afternoon/evening/flexible
  duration: Number,
  volunteersNeeded: Number,
  skillsRequired: [String],
  experienceRequired: String, // For matching
  status: String (active/inactive/completed/cancelled),
  createdBy: ObjectId (NGO),
  images: [String],
  applicants: [ObjectId],
  attendees: [ObjectId]
}
```

### Application Model
```javascript
{
  opportunityId: ObjectId,
  volunteerId: ObjectId,
  status: String (pending/accepted/rejected/attended),
  message: String,
  matchScore: Number, // 0-100 from matching algorithm
  appliedAt: Date,
  respondedAt: Date
}
```

### Message Model
```javascript
{
  conversationId: ObjectId,
  senderId: ObjectId,
  receiverId: ObjectId,
  text: String,
  isRead: Boolean,
  createdAt: Date
}
```

### Notification Model
```javascript
{
  userId: ObjectId,
  type: String (application/event/system),
  title: String,
  message: String,
  isRead: Boolean,
  relatedId: ObjectId, // Reference to related entity
  createdAt: Date
}
```

## 🤝 Contributing

We welcome contributions from the community! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/wastezero.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow code standards
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
   
   **Commit Message Convention:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Describe your changes in detail
   - Link related issues
   - Request review from maintainers

### Code Review Process
- All PRs require at least one approval
- CI/CD checks must pass
- Code must follow project standards
- Tests must have adequate coverage

## 📝 License

This project is licensed under the **ISC License**.

Copyright (c) 2025 WasteZero Team

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

## 🆘 Support & Contact

### Getting Help
- **Documentation**: Check this README and inline code comments
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

### Team Contact

### Reporting Security Issues
If you discover a security vulnerability, please email security@wastezero.com directly instead of creating a public issue.

## 🙏 Acknowledgments

- **Team A** - Development and implementation
- **Infosys** - Internship program and guidance
- **Open Source Community** - Libraries and tools used
- **Contributors** - All who have contributed to this project

## 📈 Roadmap

### Current Version (v1.0)
- ✅ Multi-role dashboard system
- ✅ User blocking and admin controls
- ✅ Real-time messaging
- ✅ Event management
- ✅ Dark mode support
- ✅ Smart matching algorithm with multi-factor scoring
- ✅ Professional email templates
- ✅ NotificationContext for state management
- ✅ Settings page with preferences

---

<div align="center">

**WasteZero** - Building a sustainable future through community engagement and environmental action. 🌱

Made with ❤️ by Team A | Infosys Internship August 2025

[Website](https://NotYetDeployed.com) • [Documentation](https://docs.wastezero.com) • [Report Bug](https://github.com/springboardmentor-104/WasteZero_Infosys_Internship_Aug2025_Team_01/issues) • [Request Feature](https://github.com/springboardmentor-104/WasteZero_Infosys_Internship_Aug2025_Team_01/issues)

</div>
