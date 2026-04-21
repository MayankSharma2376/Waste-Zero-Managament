import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Search,
  Filter,
  Star,
  Bell,
  Award,
  Activity,
  Heart,
  TrendingUp,
  Target,
  Settings,
  Moon,
  Sun
} from 'lucide-react';
import { toast } from 'react-toastify';
import StatCard from '../components/StatCard';
import OpportunityCard from '../components/OpportunityCard';
import RecentNotifications from '../components/RecentNotifications';
import UpcomingEvents from '../components/UpcomingPickups'; // Updated to use UpcomingEvents
import MatchedOpportunities from '../components/MatchedOpportunities';
import VolunteerPreferences from '../components/VolunteerPreferences';
import { volunteerAPI } from '../services/api';
import WasteZeroAnalytics from './AnalyticDashboard';

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    acceptedApplications: 0,
    totalHoursVolunteered: 0,
    upcomingEvents: 0
  });
  const [loading, setLoading] = useState(true);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [applyingTo, setApplyingTo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [enlargedImage, setEnlargedImage] = useState(null);
  const highlightIdRef = useRef(null);
  const highlightedOnceRef = useRef(false);
  // const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // // --- Dark Mode Logic ---
  // const toggleTheme = () => {
  //     const newTheme = theme === 'light' ? 'dark' : 'light';
  //     setTheme(newTheme);
  //     localStorage.setItem('theme', newTheme);
  // };

  // useEffect(() => {
  //     if (theme === 'dark') {
  //         document.documentElement.classList.add('dark');
  //     } else {
  //         document.documentElement.classList.remove('dark');
  //     }
  // }, [theme]);
  // // --- End Dark Mode Logic ---


  // Load dashboard data
  useEffect(() => {
    // Pick up any global search term set by Navbar or URL params
    try {
      const params = new URLSearchParams(location.search);
      const tab = params.get('tab');
      const id = params.get('id');
      if (tab === 'opportunities') setActiveTab('opportunities');
      if (id) highlightIdRef.current = id;
      // Explicitly do NOT sync navbar query into the in-page search input.
      // We only switch tab/highlight. The page search remains user-controlled.
    } catch {}
    loadDashboardData();
    loadUserData();
  }, []);

  // React to changes in URL query instantly (no reload needed)
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const tab = params.get('tab');
      const id = params.get('id');
      if (tab === 'opportunities') setActiveTab('opportunities');
      if (id) {
        // allow re-highlighting when a new id arrives
        highlightIdRef.current = id;
        highlightedOnceRef.current = false;
      }
    } catch {}
  }, [location.search]);

  // After opportunities load, scroll to and briefly highlight the targeted one
  useEffect(() => {
    if (!highlightIdRef.current || highlightedOnceRef.current === true) return;
    const id = highlightIdRef.current;
    const el = document.getElementById(`opp-${id}`);
    if (el) {
      highlightedOnceRef.current = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-green-400/60');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-green-400/60');
      }, 1600);
    }
  }, [opportunities]);

  // Load user data for preferences
  const loadUserData = async () => {
    try {
      const response = await volunteerAPI.getProfile();
      setUser(response.data || response);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Refresh opportunities when switching to opportunities tab
  useEffect(() => {
    if (activeTab === 'opportunities') {
      loadDashboardData();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Loading volunteer dashboard data...');
      
      const [statsResponse, opportunitiesResponse, applicationsResponse, notificationsResponse] = await Promise.all([
        volunteerAPI.getDashboardStats(),
        volunteerAPI.getAllOpportunities({ limit: 60, includeMatched: 'true' }),
        volunteerAPI.getMyApplications(),
        volunteerAPI.getNotifications().catch(err => {
          console.log('Notifications endpoint might not exist:', err);
          return { data: [] }; // Fallback to empty array
        })
      ]);

console.log('Stats response:', statsResponse);
      console.log('Opportunities response:', opportunitiesResponse);
      console.log('Applications response:', applicationsResponse);
      console.log('Notifications response:', notificationsResponse);

      // Extract data from API responses
      const statsData = statsResponse.data || statsResponse;
      const opportunitiesData = opportunitiesResponse.data || opportunitiesResponse;
      const applicationsData = applicationsResponse.data || applicationsResponse;
      const notificationsData = notificationsResponse.data || [];

       console.log('Processed stats:', statsData);
      console.log('Processed opportunities:', opportunitiesData);
      console.log('Processed applications:', applicationsData);
      console.log('Processed notifications:', notificationsData);
      
      // Debug: Check application structure
      if (applicationsData && applicationsData.length > 0) {
        console.log('Sample application structure:', applicationsData[0]);
        console.log('Sample application opportunityId:', applicationsData[0].opportunityId);
      }

      // Extract upcoming events from accepted applications
      const acceptedApplications = applicationsData.filter(app => 
        app.status === 'accepted' && 
        app.opportunityId && 
        new Date(app.opportunityId.date) > new Date()
      );
      
      const upcomingEventsData = acceptedApplications.map(app => ({
        ...app.opportunityId,
        applicationId: app._id,
        applicationDate: app.createdAt
      }));

      setStats({
        totalApplications: statsData.totalApplications || 0,
        acceptedApplications: statsData.acceptedApplications || 0,
        totalHoursVolunteered: statsData.totalHoursVolunteered || 0,
        upcomingEvents: upcomingEventsData.length
      });
      setOpportunities(opportunitiesData);
      setApplications(applicationsData);
      setUpcomingEvents(upcomingEventsData);
      setNotifications(notificationsData);
      
      console.log('Volunteer dashboard data loaded successfully');
       console.log('Upcoming events:', upcomingEventsData);
    } catch (error) {
      console.error('Error loading volunteer dashboard data:', error);
       console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler functions for buttons
  const handleViewAllEvents = () => {
    setActiveTab('applications'); // Switch to applications tab to see all events
  };

  const handleViewAllNotifications = () => {
    navigate('/volunteer/notifications');
  };

  // Function to refresh notifications
  const refreshNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const notificationsResponse = await volunteerAPI.getNotifications();
      const notificationsData = notificationsResponse.data || [];
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      // Don't show error toast as this might be expected if endpoint doesn't exist
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleApplyForOpportunity = async (opportunityId) => {
    try {
      setApplyingTo(opportunityId);
      await volunteerAPI.applyForOpportunity(opportunityId);
      toast.success('Application submitted successfully!');
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error applying for opportunity:', error);
      toast.error(error.response?.data?.message || 'Failed to apply for opportunity');
    } finally {
      setApplyingTo(null);
    }
  };

  const handleWithdrawApplication = async (applicationId) => {
    try {
      await volunteerAPI.withdrawApplication(applicationId);
      toast.success('Application withdrawn successfully');
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error withdrawing application:', error);
      toast.error('Failed to withdraw application');
    }
  };

  // Filter opportunities based on search and category
  const filteredOpportunities = opportunities.filter(opportunity => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = (opportunity.title || '').toLowerCase().includes(q) ||
                          (opportunity.description || '').toLowerCase().includes(q) ||
                          (opportunity.location || '').toLowerCase().includes(q) ||
                          (opportunity.category || '').toLowerCase().includes(q);
    const matchesCategory = filterCategory === 'all' || opportunity.category === filterCategory;
     // Show both active and inactive events
    return matchesSearch && matchesCategory;
  });

  const renderDashboardTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          stat={{
            icon: Activity,
            label: 'Total Applications',
            value: stats.totalApplications,
            change: '+12%',
            color: 'blue'
          }}
        />
        <StatCard
          stat={{
            icon: CheckCircle,
            label: 'Accepted',
            value: stats.acceptedApplications,
            change: '+8%',
            color: 'green'
          }}
        />
        <StatCard
          stat={{
            icon: Clock,
            label: 'Hours Volunteered',
            value: stats.totalHoursVolunteered,
            change: '+15%',
            color: 'purple'
          }}
        />
        <StatCard
          stat={{
            icon: Calendar,
            label: 'Upcoming Events',
            value: stats.upcomingEvents,
            change: '+5%',
            color: 'orange'
          }}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('opportunities')}
            className="p-4 text-left border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          >
            <div className="flex items-center mb-2">
              <Search className="h-8 w-8 text-green-600" />
              <Target className="h-4 w-4 text-green-500 ml-1" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Browse Smart Opportunities</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Matched opportunities appear first based on your preferences</p>
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className="p-4 text-left border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Bell className="h-8 w-8 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100">My Applications</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your applications</p>
          </button>
          <button onClick={() => navigate('/volunteer/my-profile')} className="p-4 text-left border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
            <Award className="h-8 w-8 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900 dark:text-gray-100">View Profile</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Update your information</p>
          </button>
        </div>
      </div>

      {/* Recent Activity and Matched Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MatchedOpportunities 
          onApply={handleApplyForOpportunity}
          loading={loading}
        />
        <div className="space-y-6">
          <UpcomingEvents 
            upcomingEvents={upcomingEvents}
            loading={loading}
            onViewAllEvents={handleViewAllEvents}
          />
          <RecentNotifications 
            notifications={notifications}
            loading={notificationsLoading || loading}
            onViewAllNotifications={handleViewAllNotifications}
          />
        </div>
      </div>
    </div>
  );

  const renderOpportunitiesTab = () => (
    <div className="space-y-6">
      {/* Header with explanation */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-800/50 rounded-lg p-4 border border-green-200 dark:border-green-800">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Smart Matching Active</h3>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Opportunities that match your preferences (location, waste types, skills) appear first with 
          <span className="inline-flex items-center mx-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded">
            <Star className="h-3 w-3 mr-1" />
            RECOMMENDED
          </span>
          badges. Update your preferences for better matches!
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="environmental">Environmental</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="community">Community</option>
              <option value="disaster-relief">Disaster Relief</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.map(opportunity => (
          <div id={`opp-${opportunity._id}`} data-opp-id={opportunity._id} key={opportunity._id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden transition-shadow duration-200 hover:shadow-md ${
            opportunity.isMatched ? 'border-green-300 dark:border-green-600 ring-2 ring-green-100 dark:ring-green-900/50' : 'border-gray-200 dark:border-gray-700'
          }`}>
            {/* Match Score Badge */}
            {opportunity.isMatched && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    RECOMMENDED FOR YOU
                  </span>
                  <span className="text-xs font-bold bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    {opportunity.matchScore}% match
                  </span>
                </div>
              </div>
            )}
            
            {/* Event Image */}
            {opportunity.image && (
              <div className="h-48 w-full cursor-pointer" onClick={() => setEnlargedImage(opportunity.image)}>
                <img 
                  src={opportunity.image} 
                  alt={opportunity.title}
                  className="h-full w-full object-cover hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{opportunity.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{opportunity.description}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    opportunity.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                  }`}>
                    {opportunity.status}
                  </span>
                  {opportunity.isMatched && (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 rounded-full flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      Match
                    </span>
                  )}
                </div>
              </div>

              {/* Waste Types for matched opportunities */}
              {opportunity.isMatched && opportunity.wasteTypes && opportunity.wasteTypes.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {opportunity.wasteTypes.slice(0, 3).map((wasteType, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 rounded"
                      >
                        {wasteType}
                      </span>
                    ))}
                    {opportunity.wasteTypes.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">+{opportunity.wasteTypes.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                  {opportunity.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(opportunity.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-2" />
                  {opportunity.registeredCount}/{opportunity.capacity} volunteers
                </div>
              </div>

              {/* Match breakdown for matched opportunities */}
              {opportunity.isMatched && opportunity.matchReasons && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="text-xs font-semibold text-green-800 dark:text-green-300 mb-2">Why this matches you:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center">
                      <div className="w-8 bg-gray-200 dark:bg-gray-700 rounded-full h-1 mr-2">
                        <div 
                          className="bg-green-500 h-1 rounded-full" 
                          style={{ width: `${opportunity.matchReasons.location}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">Location {opportunity.matchReasons.location}%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 bg-gray-200 dark:bg-gray-700 rounded-full h-1 mr-2">
                        <div 
                          className="bg-blue-500 h-1 rounded-full" 
                          style={{ width: `${opportunity.matchReasons.wasteTypes}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400">Interest {opportunity.matchReasons.wasteTypes}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full">
                    {opportunity.category}
                  </span>
                  {opportunity.requiredExperienceLevel && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200 rounded-full">
                      {opportunity.requiredExperienceLevel}
                    </span>
                  )}
                </div>
                {(() => {
                  const application = applications.find(app => {
                    const appOpportunityId = app.opportunityId?._id || app.opportunityId;
                    return appOpportunityId === opportunity._id;
                  });
                
                  if (application) {
                    if (application.status === 'pending') {
                      return (
                        <button
                          disabled
                          className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg cursor-not-allowed"
                        >
                          Applied - Pending
                        </button>
                      );
                    } else if (application.status === 'accepted') {
                      return (
                        <button
                          disabled
                          className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg cursor-not-allowed"
                        >
                          ✓ Accepted
                        </button>
                      );
                    } else if (application.status === 'rejected') {
                      return (
                        <button
                          disabled
                          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg cursor-not-allowed"
                        >
                          Rejected
                        </button>
                      );
                    }
                  }

                  // If opportunity is inactive, show disabled button
                  if (opportunity.status !== 'active') {
                    return (
                      <button
                        disabled
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded-lg cursor-not-allowed"
                      >
                        Event Inactive
                      </button>
                    );
                  }
                  
                  return (
                    <button
                      onClick={() => handleApplyForOpportunity(opportunity._id)}
                      disabled={opportunity.isFull || loading || applyingTo === opportunity._id}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {applyingTo === opportunity._id ? 'Applying...' : opportunity.isFull ? 'Full' : 'Apply'}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No opportunities found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );

  const renderApplicationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Applications</h2>
        </div>

        <div className="p-6">
          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map(application => (
                <div key={application._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{application.opportunityId?.title || application.opportunity?.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{application.opportunityId?.description || application.opportunity?.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(application.opportunityId?.date || application.opportunity?.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {application.opportunityId?.location || application.opportunity?.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Applied {new Date(application.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                        application.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>

                      {application.status === 'pending' && (
                        <button
                          onClick={() => handleWithdrawApplication(application._id)}
                          className="px-3 py-1 text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>

                  {application.reviewNote && (
                    <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Review Note:</span> {application.reviewNote}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No applications yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Start applying for opportunities to see them here.</p>
              <button
                onClick={() => setActiveTab('opportunities')}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Browse Opportunities
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Volunteer Dashboard</h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">Welcome back! Ready to make a difference?</p>
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 border dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'opportunities'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  Opportunities
                </button>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'applications'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  My Applications
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  My Analytics
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'preferences'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  Preferences
                </button>
              </div>
                {/* <button onClick={toggleTheme} className="p-3 rounded-lg bg-white dark:bg-gray-800 border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                    {theme === 'light' ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                </button> */}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'opportunities' && renderOpportunitiesTab()}
          {activeTab === 'applications' && renderApplicationsTab()}
          {activeTab === 'analytics' && (
            <WasteZeroAnalytics userRole="volunteer" />
          )}
          {activeTab === 'preferences' && (
            <VolunteerPreferences 
              user={user}
              onUpdate={() => {
                loadUserData();
                loadDashboardData();
              }}
            />
          )}
        </main>
      </div>
      
      {/* Image Enlargement Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={enlargedImage} 
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-2 -right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
