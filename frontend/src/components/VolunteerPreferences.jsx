// components/VolunteerPreferences.jsx
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Clock, 
  Star,
  Save,
  Settings,
  Target,
  Award,
  Navigation,
  Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { volunteerAPI } from '../services/api';

export default function VolunteerPreferences({ user, onUpdate }) {
  const [preferences, setPreferences] = useState({
    coordinates: {
      latitude: null,
      longitude: null
    },
    wasteTypePreferences: [],
    availability: {
      days: [],
      timePreference: 'flexible'
    },
    maxTravelDistance: 10,
    experienceLevel: 'beginner',
    skills: []
  });
  const [loading, setLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  const wasteTypes = [
    { value: 'organic', label: 'Organic Waste', icon: '🍃' },
    { value: 'plastic', label: 'Plastic', icon: '♻️' },
    { value: 'paper', label: 'Paper', icon: '📄' },
    { value: 'glass', label: 'Glass', icon: '🥛' },
    { value: 'metal', label: 'Metal', icon: '🔧' },
    { value: 'electronic', label: 'Electronic', icon: '💻' },
    { value: 'hazardous', label: 'Hazardous', icon: '⚠️' },
    { value: 'textile', label: 'Textile', icon: '👕' },
    { value: 'construction', label: 'Construction', icon: '🏗️' },
    { value: 'medical', label: 'Medical', icon: '🏥' }
  ];

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  const timePreferences = [
    { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
    { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)' },
    { value: 'evening', label: 'Evening (6 PM - 10 PM)' },
    { value: 'flexible', label: 'Flexible (Any time)' }
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner', description: 'New to volunteering' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some volunteer experience' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced volunteer' }
  ];

  useEffect(() => {
    // Load current preferences from user data
    if (user) {
      setPreferences({
        coordinates: user.coordinates || { latitude: null, longitude: null },
        wasteTypePreferences: user.wasteTypePreferences || [],
        availability: user.availability || { days: [], timePreference: 'flexible' },
        maxTravelDistance: user.maxTravelDistance || 10,
        experienceLevel: user.experienceLevel || 'beginner',
        skills: user.skills || []
      });
    }
  }, [user]);

  const handleWasteTypeToggle = (wasteType) => {
    setPreferences(prev => ({
      ...prev,
      wasteTypePreferences: prev.wasteTypePreferences.includes(wasteType)
        ? prev.wasteTypePreferences.filter(type => type !== wasteType)
        : [...prev.wasteTypePreferences, wasteType]
    }));
  };

  const handleDayToggle = (day) => {
    setPreferences(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        days: prev.availability.days.includes(day)
          ? prev.availability.days.filter(d => d !== day)
          : [...prev.availability.days, day]
      }
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !preferences.skills.includes(newSkill.trim())) {
      setPreferences(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setPreferences(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPreferences(prev => ({
          ...prev,
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }));
        toast.success('Location updated successfully');
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error('Failed to get location. Please check your browser permissions.');
        setLocationLoading(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await volunteerAPI.updatePreferences(preferences);
      toast.success('Preferences updated successfully!');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error(error.response?.data?.message || 'Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 dark:border dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Settings className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
          Volunteer Preferences
        </h2>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      <div className="space-y-8">
        {/* Location Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Location & Travel
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Location
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  {locationLoading ? 'Getting Location...' : 'Use Current Location'}
                </button>
                {preferences.coordinates.latitude && preferences.coordinates.longitude && (
                  <span className="text-sm text-green-600 dark:text-green-400">
                    ✓ Location set ({preferences.coordinates.latitude.toFixed(4)}, {preferences.coordinates.longitude.toFixed(4)})
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Maximum Travel Distance: {preferences.maxTravelDistance} km
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={preferences.maxTravelDistance}
                onChange={(e) => setPreferences(prev => ({ ...prev, maxTravelDistance: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>1 km</span>
                <span>50 km</span>
                <span>100 km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Waste Type Preferences */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
            Waste Type Preferences
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Select the types of waste management activities you're interested in:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {wasteTypes.map((wasteType) => (
              <button
                key={wasteType.value}
                onClick={() => handleWasteTypeToggle(wasteType.value)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  preferences.wasteTypePreferences.includes(wasteType.value)
                    ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:text-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{wasteType.icon}</div>
                <div className="text-xs font-medium">{wasteType.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
            Availability
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available Days
              </label>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.value}
                    onClick={() => handleDayToggle(day.value)}
                    className={`p-2 text-sm font-medium rounded-lg border-2 transition-all ${
                      preferences.availability.days.includes(day.value)
                        ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:text-gray-300'
                    }`}
                  >
                    {day.label.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Time
              </label>
              <select
                value={preferences.availability.timePreference}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  availability: { ...prev.availability, timePreference: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {timePreferences.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Experience Level */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
            Experience Level
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {experienceLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => setPreferences(prev => ({ ...prev, experienceLevel: level.value }))}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  preferences.experienceLevel === level.value
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/50'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">{level.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{level.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4 flex items-center">
            <Star className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400" />
            Skills & Interests
          </h3>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add a skill or interest..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                Add
              </button>
            </div>

            {preferences.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {preferences.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}