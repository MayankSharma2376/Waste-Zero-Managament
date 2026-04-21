# WasteZero - Environmental Impact Management Platform

WasteZero is a comprehensive environmental management platform designed to connect communities, volunteers, and administrators in waste management and sustainability initiatives. The platform enables efficient coordination of waste collection, recycling programs, and environmental opportunities.

## 🌱 Features

### User Management
- **Multi-role Authentication**: Admin, Volunteer, and NGO roles
- **Secure Login/Registration**: JWT-based authentication with password reset functionality
- **Role-based Dashboards**: Customized interfaces for different user types

### Admin Dashboard
- **Environmental Opportunities Management**: Create and manage community eco-initiatives
- **Pickup Scheduling**: Coordinate waste collection and recycling pickups
- **Agent Management**: Monitor and assign waste collection agents
- **Analytics & Reporting**: Track environmental impact and generate reports

### Volunteer Dashboard
- **Opportunity Discovery**: Browse and join environmental initiatives
- **Pickup Scheduling**: Schedule waste collection services
- **Progress Tracking**: Monitor personal environmental contributions

### Core Functionality
- **Forgot Password Flow**: Complete OTP-based password recovery
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Notifications**: Toast notifications for user feedback
- **Search & Filter**: Find opportunities and manage data efficiently

## 🚀 Technology Stack

### Frontend
- **React 19.1.1**: Modern React with hooks and components
- **Vite 5.4.19**: Fast build tool and development server
- **React Router DOM 6.26.1**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **React Toastify**: Toast notification system

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **bcrypt**: Password hashing
- **Nodemailer**: Email service for OTP

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with required variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file in the backend directory:
```
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb://localhost:27017/wastezero
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🏗️ Project Structure

```
WasteZero/
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Main application pages
│   │   ├── services/         # API service functions
│   │   ├── constants/        # App constants and dummy data
│   │   └── assets/           # Static assets
├── backend/
│   ├── controllers/          # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── lib/                 # Database connection
│   └── src/                 # Server configuration
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/send-otp` - Send password reset OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

### Admin Operations
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `POST /api/admin/opportunities` - Create environmental opportunity
- `GET /api/admin/pickups` - Get pickup schedules
- `GET /api/admin/agents` - Get agent information

## 🎯 Usage

1. **Getting Started**: Visit the homepage and register as a volunteer or admin
2. **Login**: Use your credentials to access your dashboard
3. **Explore Opportunities**: Browse environmental initiatives in your area
4. **Schedule Pickups**: Coordinate waste collection services
5. **Track Progress**: Monitor your environmental impact

## 🛠️ Development

### Available Scripts

#### Frontend
- `npm start` - Start development server
- `npm test` - Run test runner
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- Tailwind CSS for consistent styling

## 🌍 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🤝 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🎉 Acknowledgments

- Thanks to all contributors who have helped build this platform
- Special thanks to the environmental community for inspiration
- Built with ❤️ for a sustainable future
