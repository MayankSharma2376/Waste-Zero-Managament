// routes/ngo.routes.js
const express = require('express');
const router = express.Router();

const {
  getProfile,
  updateProfile,
  getDashboardStats,
  getRecentActivities,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
  reviewApplication, // Kept from 'main' branch
  getMyVolunteers,
  getVolunteerDetails,
  sendMessageToVolunteer,
  getEventReport,
  getVolunteerReport,
  // New attendance functions
  getEventAttendance,
  markAttendance,
  markAllPresent,
  exportAttendanceReport,
  // Analytics functions
  getAnalyticsData,
  getVolunteerAnalytics
} = require('../controllers/ngo.controller');

const protectRoute = require('../middleware/protectRoute');

// Apply authentication middleware to all routes
router.use(protectRoute);

// Optional: Add role-based access control middleware
const requireNGORole = (req, res, next) => {
  if (req.user.role && req.user.role !== 'ngo') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. NGO role required.'
    });
  }
  next();
};

// Apply NGO role check (commented out for development - uncomment for production)
// router.use(requireNGORole);

// Test route to verify server is working
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'NGO routes working', user: req.user });
});

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activities', getRecentActivities);

// Event management routes
router.get('/events', getMyEvents);
router.post('/events', createEvent);
router.put('/events/:eventId', updateEvent);
router.delete('/events/:eventId', deleteEvent);
router.get('/events/:eventId/registrations', getEventRegistrations);
// Added the review application route from the 'main' branch
router.post('/events/:eventId/registrations/:registrationId/review', reviewApplication);

// Volunteer management routes
router.get('/volunteers', getMyVolunteers);
router.get('/volunteers/:volunteerId', getVolunteerDetails);
router.post('/volunteers/:volunteerId/message', sendMessageToVolunteer);

// Reports routes
router.get('/reports/event/:eventId', getEventReport);
router.get('/reports/volunteers', getVolunteerReport);

// Attendance management routes
router.get('/events/:eventId/attendance', getEventAttendance);
router.post('/events/:eventId/attendance/:volunteerId', markAttendance);
router.post('/events/:eventId/attendance/mark-all-present', markAllPresent);
router.get('/events/:eventId/attendance/export', exportAttendanceReport);

// Analytics routes
router.get('/analytics', protectRoute, getAnalyticsData);
router.get('/analytics/volunteer/:volunteerId', protectRoute, getVolunteerAnalytics);

module.exports = router;