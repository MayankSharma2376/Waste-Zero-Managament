import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Leaf, Trash2, Users, Award, TreePine, Recycle, MapPin, Clock, Calendar, Target, TrendingUp, Sparkles, BarChart3, Activity, Eye, RefreshCw, PieChart as PieChartIcon, Download, FileText } from 'lucide-react';
import { ngoAPI, adminAPI, volunteerAPI } from '../services/api';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const WasteZeroAnalytics = ({ userRole = 'volunteer', userId = null }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // overview, user-detail


  const loadAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      
      console.log('🔄 Loading analytics for user role:', userRole, 'Time range:', timeRange);
      
      if (userRole === 'admin') {
        response = await adminAPI.getAnalytics(timeRange);
      } else if (userRole === 'ngo') {
        console.log('📞 Calling NGO analytics API...');
        response = await ngoAPI.getAnalytics(timeRange);
      } else if (userRole === 'volunteer') {
       
        response = await volunteerAPI.getAnalytics();
      }
      
      console.log('📊 Analytics API response:', response); // Debug log
      
      if (response && response.success && response.data) {
        console.log('✅ Setting real analytics data:');
        console.log('📊 Overview:', response.data.overview);
        console.log('📈 Monthly data:', response.data.monthlyData?.length, 'entries');
        console.log('🏷️ Activity types:', response.data.activityTypeData?.length, 'categories');
        console.log('👥 Top volunteers:', response.data.topVolunteers?.length, 'volunteers');
        setAnalyticsData(response.data);
      } else {
        console.log('⚠️ Analytics response not successful or no data, using fallback data');
        console.log('Response details:', { 
          hasResponse: !!response, 
          success: response?.success, 
          hasData: !!response?.data 
        });
       
        setAnalyticsData(generateFallbackData());
      }
    } catch (error) {
      console.error('❌ Error loading analytics:', error);
      console.log('🔧 Using fallback data due to error');
     
      setAnalyticsData(generateFallbackData());
    } finally {
      setLoading(false);
    }
  }, [userRole, timeRange]); 

 
  const generateFallbackData = () => {
    const currentDate = new Date();
    const monthlyData = [];
    
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      monthlyData.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        events: Math.floor(Math.random() * 5) + 1, 
        applications: Math.floor(Math.random() * 8) + 2, 
        accepted: Math.floor(Math.random() * 5) + 1,
        volunteers: Math.floor(Math.random() * 15) + 3,
        waste: Math.floor(Math.random() * 200) + 50,
        hours: Math.floor(Math.random() * 80) + 20
      });
    }

    const activityTypeData = [
      { name: 'Environmental', value: 45, count: 18 },
      { name: 'Community', value: 25, count: 10 },
      { name: 'Education', value: 20, count: 8 },
      { name: 'Health', value: 10, count: 4 }
    ];

    const overview = {
      totalVolunteers: 12,
      totalEvents: 8,
      totalVolunteerHours: 180,
      wasteCollected: 240,
      treesPlanted: 15,
      co2Saved: 120,
      totalApplications: 40,
      acceptedApplications: 28,
      pendingApplications: 8,
      rejectedApplications: 4
    };

    const topVolunteers = [
      { id: 1, name: 'Alice Johnson', eventsParticipated: 5, totalHours: 25 },
      { id: 2, name: 'Bob Smith', eventsParticipated: 4, totalHours: 20 },
      { id: 3, name: 'Carol Davis', eventsParticipated: 3, totalHours: 18 }
    ];

    const recentActivities = [
      { id: 1, event: 'Community Garden Project', status: 'accepted', date: new Date(), location: 'Green Valley' },
      { id: 2, event: 'River Cleanup Drive', status: 'pending', date: new Date(), location: 'Riverside Park' },
      { id: 3, event: 'Recycling Workshop', status: 'accepted', date: new Date(), location: 'Community Center' }
    ];

    return {
      overview,
      monthlyData,
      activityTypeData,
      topVolunteers,
      recentActivities
    };
  };

  // Load specific user analytics
  const loadUserAnalytics = async (targetUserId, targetUserRole) => {
    try {
      setLoading(true);
      let response;
      
      if (targetUserRole === 'ngo') {
        response = await adminAPI.getNGOAnalytics(targetUserId, timeRange);
      } else {
        response = await adminAPI.getVolunteerAnalytics(targetUserId);
      }
      
      if (response.success) {
        setSelectedUser(response.data);
        setViewMode('user-detail');
      } else {
        toast.error('Failed to load user analytics');
      }
    } catch (error) {
      console.error('Error loading user analytics:', error);
      toast.error('Failed to load user analytics');
    } finally {
      setLoading(false);
    }
  };

  // Export analytics report as PDF
  const exportAnalyticsReport = async () => {
    try {
      toast.info('Generating analytics report... Please wait.');
      
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const { overview = {}, monthlyData = [], activityTypeData = [] } = analyticsData || {};
      
      // Create report content
      const reportContent = `
        <html>
          <head>
            <title>WasteZero Analytics Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #16a34a; padding-bottom: 20px; }
              .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
              .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f9f9f9; }
              .stat-value { font-size: 24px; font-weight: bold; color: #16a34a; }
              .stat-label { font-size: 12px; color: #666; text-transform: uppercase; }
              .section { margin: 30px 0; }
              .section h2 { color: #16a34a; border-bottom: 1px solid #16a34a; padding-bottom: 10px; }
              .activity-list { list-style: none; padding: 0; }
              .activity-item { background: #f8f9fa; margin: 8px 0; padding: 10px; border-radius: 5px; border-left: 4px solid #16a34a; }
              .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🌱 WasteZero Analytics Report</h1>
              <p>Generated on ${currentDate}</p>
              <p>Analytics for ${userRole.toUpperCase()} Dashboard</p>
            </div>
            
            <div class="section">
              <h2>📊 Key Metrics</h2>
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">${overview.totalVolunteers || overview.totalUsers || 0}</div>
                  <div class="stat-label">${userRole === 'admin' ? 'Total Users' : 'Volunteers'}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${overview.totalEvents || overview.totalVolunteerHours || 0}</div>
                  <div class="stat-label">${userRole === 'admin' ? 'Total Events' : 'Volunteer Hours'}</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${overview.wasteCollected || 0}kg</div>
                  <div class="stat-label">Waste Collected</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">${overview.treesPlanted || 0}</div>
                  <div class="stat-label">Trees Planted</div>
                </div>
              </div>
            </div>
            
            <div class="section">
              <h2>📈 Monthly Activity</h2>
              <ul class="activity-list">
                ${monthlyData.slice(0, 6).map(item => `
                  <li class="activity-item">
                    <strong>${item.month}</strong>: 
                    ${item.events || item.applications || 0} 
                    ${userRole === 'ngo' ? 'events created' : userRole === 'volunteer' ? 'applications submitted' : 'activities'}
                  </li>
                `).join('')}
              </ul>
            </div>
            
            <div class="section">
              <h2>🏷️ Activity Categories</h2>
              <ul class="activity-list">
                ${activityTypeData.map(category => `
                  <li class="activity-item">
                    <strong>${category.name}</strong>: ${category.value}% (${category.count || 0} activities)
                  </li>
                `).join('')}
              </ul>
            </div>
            
            <div class="footer">
              <p>This report was automatically generated by WasteZero Analytics</p>
              <p>For support, contact: support@wastezero.com</p>
            </div>
          </body>
        </html>
      `;
      
      // Open print window
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Pop-up blocked. Please allow pop-ups and try again.');
      }
      
      printWindow.document.write(reportContent);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        
        setTimeout(() => {
          printWindow.close();
        }, 100);
      }, 500);
      
      toast.success('📄 Analytics report generated successfully!');
      
    } catch (error) {
      console.error('Error exporting analytics report:', error);
      toast.error('Failed to generate report. Please try again.');
    }
  };

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]); // Use loadAnalyticsData as dependency

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="text-gray-600 dark:text-gray-300 font-medium">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Analytics Data</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Unable to load analytics data</p>
          <button
            onClick={loadAnalyticsData}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Render user detail view
  if (viewMode === 'user-detail' && selectedUser) {
    return (
      <div className="space-y-6">
        {/* Back Button and Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setViewMode('overview')}
              className="mr-4 p-2 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {selectedUser.volunteer ? selectedUser.volunteer.name : selectedUser.ngo.name} Analytics
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Detailed performance metrics</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">Impact Score</p>
            <p className="text-green-600 text-sm">{selectedUser.stats.impactScore || 'N/A'}</p>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 dark:border dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-800 dark:text-green-400">{selectedUser.stats.totalApplications || selectedUser.stats.totalEvents}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{selectedUser.volunteer ? 'APPLICATIONS' : 'EVENTS'}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-800 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 dark:border dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-800 dark:text-green-400">{selectedUser.stats.hoursVolunteered || selectedUser.stats.totalVolunteerHours}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">HOURS</p>
              </div>
              <Clock className="h-8 w-8 text-green-800 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 dark:border dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-800 dark:text-green-400">{selectedUser.stats.wasteCollected}kg</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">WASTE COLLECTED</p>
              </div>
              <Trash2 className="h-8 w-8 text-green-800 dark:text-green-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 dark:border dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-800 dark:text-green-400">{selectedUser.stats.treesPlanted}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">TREES PLANTED</p>
              </div>
              <TreePine className="h-8 w-8 text-green-800 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-2 gap-6">
          {/* Monthly Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 dark:border dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Monthly Activity</h3>
            {(selectedUser.monthlyData && selectedUser.monthlyData.length > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={selectedUser.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey={selectedUser.volunteer ? "applications" : "events"} 
                    stroke="#166534" 
                    fill="#166534" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-300 font-medium">No activity data yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Data will appear as activities are recorded</p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 dark:border dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Recent Activities</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(selectedUser.recentActivities && selectedUser.recentActivities.length > 0) ? 
                selectedUser.recentActivities.map((activity, index) => (
                  <div key={index} className="border border-gray-100 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {activity.type === 'Event Created' ? activity.event : 
                           activity.user ? `${activity.user} applied for ${activity.event}` : activity.event}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(activity.date).toLocaleDateString()}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{activity.type}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        activity.status === 'accepted' || activity.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300' :
                        activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-300' :
                        activity.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    {activity.location && (
                      <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{activity.location}</span>
                      </div>
                    )}
                  </div>
                )) :
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activities</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Activities will appear here as they occur</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { 
    overview = {}, 
    monthlyData = [], 
    activityTypeData = [], 
    recentActivities = [], 
    topVolunteers = [], 
    userGrowthData = [], 
    eventActivityData = [], 
    topNGOs = [], 
    categoryDistribution = [] 
  } = analyticsData || {};

  // Debug logging
  console.log('🔍 Analytics data received:', analyticsData);
  console.log('📊 Monthly data:', monthlyData, 'Length:', monthlyData?.length);
  console.log('🏷️ Activity type data:', activityTypeData, 'Length:', activityTypeData?.length);
  console.log('👤 User role:', userRole);
  console.log('📈 Chart data validation:', {
    monthlyDataValid: Array.isArray(monthlyData) && monthlyData.length > 0,
    activityDataValid: Array.isArray(activityTypeData) && activityTypeData.length > 0
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {userRole === 'admin' ? 'Platform Analytics' : 
             userRole === 'ngo' ? 'NGO Analytics' : 'My Analytics'}
          </h2>
          <button
            onClick={exportAnalyticsReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadAnalyticsData}
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="week">7 DAYS</option>
            <option value="month">1 MONTH</option>
            <option value="quarter">3 MONTHS</option>
            <option value="year">1 YEAR</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 dark:border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-800 dark:text-green-400">
                {userRole === 'admin' ? (overview.totalUsers || 0) : 
                 userRole === 'ngo' ? (overview.totalVolunteers || 0) : 
                 (overview.totalApplications || 0)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                {userRole === 'admin' ? 'TOTAL USERS' : 
                 userRole === 'ngo' ? 'VOLUNTEERS' : 
                 'APPLICATIONS'}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-800 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 dark:border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-800 dark:text-green-400">
                {userRole === 'admin' ? (overview.totalEvents || 0) : 
                 (overview.totalVolunteerHours || 0)}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                {userRole === 'admin' ? 'TOTAL EVENTS' : 'VOLUNTEER HOURS'}
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-800 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 dark:border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-800 dark:text-green-400">{overview.wasteCollected || 0}kg</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">WASTE COLLECTED</p>
            </div>
            <Trash2 className="h-8 w-8 text-green-800 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 dark:border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-800 dark:text-green-400">{overview.treesPlanted || 0}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">TREES PLANTED</p>
            </div>
            <TreePine className="h-8 w-8 text-green-800 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Impact Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 dark:border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            {userRole === 'admin' ? 'Platform Growth' : 
             userRole === 'ngo' ? 'Events Created This Year' : 'My Applications Over Time'}
          </h3>
          {userRole === 'admin' ? 
            // Use userGrowthData for admin Platform Growth chart
            (userGrowthData && userGrowthData.length > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value, name) => [value, 'New Users']}
                  />
                  <Bar 
                    dataKey="users" 
                    fill="#166534" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p>No user growth data yet</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Platform growth will appear as users register</p>
                </div>
              </div>
            )
            :
            // Use monthlyData for NGO and volunteer charts
            (monthlyData && monthlyData.length > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value, name) => [
                      value, 
                      userRole === 'ngo' ? 'Events Created' : 'Applications'
                    ]}
                  />
                  <Bar 
                    dataKey={userRole === 'ngo' ? 'events' : 'applications'} 
                    fill="#166534" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p>{userRole === 'volunteer' ? 'No applications yet' : 'No events created yet'}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    {userRole === 'volunteer' ? 'Apply to events to see your activity chart' : 'Create your first event to see the chart'}
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* Activity Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 dark:border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            {userRole === 'admin' ? 'Event Categories' : 
             userRole === 'ngo' ? 'My Event Categories' : 'Event Categories I Participate In'}
          </h3>
          {(activityTypeData && activityTypeData.length > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={activityTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  dataKey="value"
                  // label={({ name, value }) => `${name}: ${value}%`}
                  labelLine={false}
                >
                  {activityTypeData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`hsl(${(index * 137.5) % 360}, 70%, 40%)`}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, `${name}`]} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <PieChartIcon className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                <p>{userRole === 'volunteer' ? 'No event participation yet' : 'No event categories yet'}</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  {userRole === 'volunteer' ? 'Join events to see your activity breakdown' : 'Create events with categories to see the breakdown'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Top Performers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 dark:border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            {userRole === 'admin' ? 'Top NGOs' : 
             userRole === 'ngo' ? 'Top Volunteers' : 'NGOs I\'ve Worked With'}
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {userRole === 'admin' ?
              // Show top NGOs for admin (from backend topNGOs data)
              (analyticsData?.topNGOs && analyticsData.topNGOs.length > 0) ? 
                analyticsData.topNGOs.slice(0, 5).map((ngo, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-100 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    onClick={() => loadUserAnalytics(ngo.id, 'ngo')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{ngo.name || 'Unknown NGO'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{ngo.totalEvents} events created</p>
                      </div>
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )) :
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No NGOs yet</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Waiting for NGO registrations</p>
                </div>
            : userRole === 'volunteer' ? 
              // Show NGOs worked with for volunteers (from backend data)
              (analyticsData?.ngosWorkedWith && analyticsData.ngosWorkedWith.length > 0) ? 
                analyticsData.ngosWorkedWith.slice(0, 5).map((ngo, index) => (
                  <div key={index} className="border border-gray-100 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{ngo.name || 'Unknown NGO'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Partner NGO</p>
                      </div>
                    </div>
                  </div>
                )) :
                // Show message if no NGO partnerships yet
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No NGO partnerships yet</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Apply to events to work with NGOs</p>
                </div>
              :
              // Show top volunteers for NGO (from backend data)
              (analyticsData?.topVolunteers && analyticsData.topVolunteers.length > 0) ?
                analyticsData.topVolunteers.slice(0, 5).map((volunteer, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-100 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    onClick={() => userRole === 'admin' && loadUserAnalytics(volunteer.id || volunteer._id, 'volunteer')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {volunteer.name || 'Unknown Volunteer'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {volunteer.eventsParticipated || 0} events participated
                        </p>
                      </div>
                      {userRole === 'admin' && (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                )) :
                // Show message if no volunteers yet for NGO
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No volunteers yet</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Create events to attract volunteers</p>
                </div>
            }
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 dark:border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            {userRole === 'volunteer' ? 'My Recent Applications' : 'Recent Activities'}
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {userRole === 'volunteer' ? 
              // Show volunteer's own applications
              (analyticsData?.recentActivities || []).map((activity, index) => (
                <div key={index} className="border border-gray-100 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{activity.event}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(activity.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      activity.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300' :
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-300'
                    }`}>
                      {activity.status}
                    </span>
                  </div>
                  {activity.location && (
                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{activity.location}</span>
                    </div>
                  )}
                </div>
              )) :
              // Enhanced recent activities for admin/ngo
              (recentActivities || []).map((activity, index) => (
                <div key={activity.id || index} className="border border-gray-100 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {activity.name || activity.description || activity.event}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(activity.date).toLocaleDateString()}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {activity.type && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            activity.type === 'Event Created' ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300' :
                            activity.type === 'Application' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' :
                            activity.type === 'User Registration' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {activity.type}
                          </span>
                        )}
                        {activity.category && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                            {activity.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right ml-3">
                      {activity.status && (
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          activity.status === 'accepted' || activity.status === 'completed' || activity.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300' :
                          activity.status === 'pending' || activity.status === 'upcoming' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-300' :
                          activity.status === 'cancelled' || activity.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {activity.status}
                        </span>
                      )}
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 dark:border dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Environmental Impact</h3>
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Trash2 className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Waste Collected</span>
                </div>
                <span className="text-lg font-bold text-green-600">{overview.wasteCollected || 0}kg</span>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <TreePine className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Trees Planted</span>
                </div>
                <span className="text-lg font-bold text-green-600">{overview.treesPlanted || 0}</span>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Leaf className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CO₂ Saved</span>
                </div>
                <span className="text-lg font-bold text-green-600">{overview.co2Saved || 0}kg</span>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Volunteer Hours</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{overview.totalVolunteerHours || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteZeroAnalytics;