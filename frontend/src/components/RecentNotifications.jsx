import React from "react";
import { Bell, CheckCircle, XCircle, Clock, Calendar, AlertCircle, ChevronRight } from "lucide-react";

const RecentNotifications = ({ notifications = [], loading = false, onViewAllNotifications }) => {
  
  // Helper function to get icon for notification type
  const getNotificationIcon = (type) => {
    const iconProps = { className: "h-5 w-5" };
    
    switch (type) {
      case 'application_accepted':
        return <CheckCircle {...iconProps} className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case 'application_rejected':
        return <XCircle {...iconProps} className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'application_pending':
        return <Clock {...iconProps} className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />;
      case 'event_reminder':
        return <Calendar {...iconProps} className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      case 'event_cancelled':
        return <XCircle {...iconProps} className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case 'event_updated':
        return <AlertCircle {...iconProps} className="h-5 w-5 text-orange-600 dark:text-orange-400" />;
      default:
        return <Bell {...iconProps} className="h-5 w-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  // Helper function to get background color for notification type
  const getNotificationBgColor = (type) => {
    switch (type) {
      case 'application_accepted':
        return 'bg-green-100 dark:bg-green-900/50';
      case 'application_rejected':
        return 'bg-red-100 dark:bg-red-900/50';
      case 'application_pending':
        return 'bg-yellow-100 dark:bg-yellow-900/50';
      case 'event_reminder':
        return 'bg-blue-100 dark:bg-blue-900/50';
      case 'event_cancelled':
        return 'bg-red-100 dark:bg-red-900/50';
      case 'event_updated':
        return 'bg-orange-100 dark:bg-orange-900/50';
      default:
        return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMs = now - notificationTime;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays === 1) {
      return '1d ago';
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return notificationTime.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:border dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Recent Notifications</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Important updates and reminders.</p>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading notifications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:border dark:border-gray-700 h-fit">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Recent Notifications</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Important updates and reminders.</p>
      <div className="space-y-2 min-h-[200px]">
        {notifications.length > 0 ? (
          notifications.slice(0, 4).map((notification) => (
            <div 
              key={notification._id || notification.id} 
              className="flex items-start justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors"
            >
              <div className="flex items-start min-w-0 flex-1">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full ${getNotificationBgColor(notification.type)} flex items-center justify-center mt-0.5`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-tight">{notification.message || notification.text}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatTimeAgo(notification.createdAt || notification.timestamp)}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1" />
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No notifications yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Updates will appear here</p>
          </div>
        )}
      </div>
      <button 
        onClick={onViewAllNotifications}
        className="mt-4 w-full py-2 text-sm font-semibold text-green-600 dark:text-green-400 border border-green-600 dark:border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/40 transition-colors"
      >
        View All Notifications
      </button>
    </div>
  );
};

export default RecentNotifications;