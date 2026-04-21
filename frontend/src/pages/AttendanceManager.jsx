import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, Users, Clock, Check, X, Download, UserCheck, AlertCircle, CheckCircle2, Moon, Sun } from 'lucide-react';
import { ngoAPI } from '../services/api';
import { toast } from 'react-toastify';

const AttendanceManager = ({ eventId, onClose }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // // You can pass a theme prop from the parent, or let this component manage it.
  // const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // useEffect(() => {
  //   if (localStorage.getItem('theme') === 'dark') {
  //     setTheme('dark');
  //   }
  // }, []);

  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
    
    // Also show toast notification
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else {
      toast.info(message);
    }
  }, []);

  // Load attendance data
  const loadAttendanceData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ngoAPI.getEventAttendance(eventId);
      if (response.success) {
        setAttendanceData(response.data);
      } else {
        showNotification('Failed to load attendance data', 'error');
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      showNotification('Failed to load attendance data', 'error');
    } finally {
      setLoading(false);
    }
  }, [eventId, showNotification]);

  // Mark individual attendance
  const markAttendance = useCallback(async (volunteerId, status, notes = '') => {
    try {
      setActionLoading(true);
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      const response = await ngoAPI.markAttendance(eventId, volunteerId, {
        status,
        arrivalTime: (status === 'present' || status === 'late') ? currentTime : '',
        notes
      });

      if (response.success) {
        showNotification(response.message, 'success');
        await loadAttendanceData(); // Reload data
      } else {
        showNotification('Failed to mark attendance', 'error');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      showNotification('Failed to mark attendance', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [eventId, loadAttendanceData, showNotification]);

  // Mark all present
  const markAllPresent = useCallback(async () => {
    try {
      setActionLoading(true);
      const response = await ngoAPI.markAllPresent(eventId, 'Bulk marked present by NGO');
      
      if (response.success) {
        showNotification(response.message, 'success');
        await loadAttendanceData(); // Reload data
      } else {
        showNotification('Failed to mark all present', 'error');
      }
    } catch (error) {
      console.error('Error marking all present:', error);
      showNotification('Failed to mark all present', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [eventId, loadAttendanceData, showNotification]);

  // Export attendance report
  const exportAttendanceCSV = useCallback(async () => {
    try {
      setActionLoading(true);
      await ngoAPI.exportAttendanceReport(eventId);
      showNotification('Attendance report exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting report:', error);
      showNotification('Failed to export attendance report', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [eventId, showNotification]);

  useEffect(() => {
    if (eventId) {
      loadAttendanceData();
    }
  }, [eventId, loadAttendanceData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Loading attendance data...</span>
      </div>
    );
  }

  if (!attendanceData) {
    return (
      <div className="flex items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Failed to load attendance data</p>
          <button 
            onClick={loadAttendanceData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { event, volunteers, stats } = attendanceData;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <UserCheck className="w-6 h-6" />
              Attendance Manager
            </h2>
            <p className="text-blue-100 mt-1">Track volunteer attendance for your events</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-600/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Event</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{event.title}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{new Date(event.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100">{event.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-300">{stats.total}</div>
            <div className="text-sm text-blue-700 dark:text-blue-200">Total Volunteers</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-300">{stats.present}</div>
            <div className="text-sm text-green-700 dark:text-green-200">Present</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-300">{stats.absent}</div>
            <div className="text-sm text-red-700 dark:text-red-200">Absent</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">{stats.late}</div>
            <div className="text-sm text-yellow-700 dark:text-yellow-200">Late</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">{stats.pending}</div>
            <div className="text-sm text-gray-700 dark:text-gray-200">Pending</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={markAllPresent}
            disabled={actionLoading || volunteers.length === 0}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark All Present
          </button>
          <button
            onClick={exportAttendanceCSV}
            disabled={actionLoading || volunteers.length === 0}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={loadAttendanceData}
            disabled={actionLoading}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Volunteers List */}
      <div className="p-6">
        {volunteers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No accepted volunteers for this event</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Volunteer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Arrival Time</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((volunteer) => (
                  <tr key={volunteer.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center mr-3 font-semibold">
                          {volunteer.volunteerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{volunteer.volunteerName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Applied: {new Date(volunteer.appliedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-900 dark:text-gray-100">{volunteer.email}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{volunteer.phone || 'No phone'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        volunteer.attendanceStatus === 'present' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                        volunteer.attendanceStatus === 'absent' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                        volunteer.attendanceStatus === 'late' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                      }`}>
                        {volunteer.attendanceStatus.charAt(0).toUpperCase() + volunteer.attendanceStatus.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-900 dark:text-gray-100">{volunteer.arrivalTime || '-'}</p>
                      {volunteer.notes && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{volunteer.notes}</p>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => markAttendance(volunteer.volunteerId, 'present')}
                          disabled={actionLoading}
                          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                        >
                          Present
                        </button>
                        <button
                          onClick={() => markAttendance(volunteer.volunteerId, 'late')}
                          disabled={actionLoading}
                          className="px-2 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 disabled:opacity-50"
                        >
                          Late
                        </button>
                        <button
                          onClick={() => markAttendance(volunteer.volunteerId, 'absent')}
                          disabled={actionLoading}
                          className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notifications */}
      {notifications.map(n => (
        <div 
          key={n.id} 
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            n.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
            n.type === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' :
            'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
          }`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
};

export default AttendanceManager;