import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

// Component to display upcoming events the volunteer has been accepted to
const UpcomingEvents = ({ upcomingEvents = [], loading = false, onViewAllEvents }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:border dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Upcoming Events</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Events you're registered for.</p>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:border dark:border-gray-700 h-fit">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Upcoming Events</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Events you're registered for.</p>
      <div className="space-y-3 min-h-[200px]">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.slice(0, 3).map((event) => (
            <div key={event._id || event.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 dark:text-gray-100 truncate">{event.title || event.name}</p>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                Registered
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming events</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Apply to events to see them here</p>
          </div>
        )}
      </div>
      <button 
        onClick={onViewAllEvents}
        className="mt-4 w-full py-2 text-sm font-semibold text-green-600 dark:text-green-400 border border-green-600 dark:border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/40 transition-colors"
      >
        View All Events
      </button>
    </div>
  );
};

export default UpcomingEvents;