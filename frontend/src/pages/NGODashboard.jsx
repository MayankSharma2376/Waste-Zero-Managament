import React, { useState, useEffect, useCallback, memo } from 'react'
import {
  Users,
  Calendar,
  TrendingUp,
  MapPin,
  MessageSquare,
  RefreshCw,
  Plus,
  X,
  Save,
  Clock,
  Phone,
  Mail,
  Eye,
  Edit,
  UserCheck,
  Heart,
  Award,
  Target,
  Activity,
  BarChart3,
  CheckCircle,
  XCircle,
  Trash2,
  Upload,
  Image,
  FileText,
  AlertCircle,
  Moon,
  Sun
} from 'lucide-react'
import { ngoAPI } from '../services/api'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'
import Side from '../components/Side'
import AttendanceManager from './AttendanceManager'
import WasteZeroAnalytics from './AnalyticDashboard'

// Modern CreateEventModal component with enhanced UI
const CreateEventModal = memo(({
  showModal,
  setShowModal,
  newEvent,
  handleNewEventChange,
  handleCreateEvent,
  loading
}) => {
  if (!showModal) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        handleNewEventChange('imagePreview', e.target.result);
        handleNewEventChange('image', file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    handleNewEventChange('image', null);
    handleNewEventChange('imagePreview', null);
  };

  const handleSkillToggle = (skill) => {
    const currentSkills = newEvent.requiredSkills || [];
    const updatedSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    handleNewEventChange('requiredSkills', updatedSkills);
  };

  const handleWasteTypeToggle = (wasteType) => {
    const currentWasteTypes = newEvent.wasteTypes || [];
    const updatedWasteTypes = currentWasteTypes.includes(wasteType)
      ? currentWasteTypes.filter(w => w !== wasteType)
      : [...currentWasteTypes, wasteType];
    handleNewEventChange('wasteTypes', updatedWasteTypes);
  };

  const availableSkills = [
    'Environmental Conservation',
    'Community Organizing',
    'Event Management',
    'Public Speaking',
    'Social Media',
    'Photography',
    'First Aid',
    'Teaching',
    'Fundraising',
    'Technical Skills'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-5xl w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-3xl font-bold">Create New Event</h3>
              <p className="text-green-100 mt-1">Organize impactful community events for waste management</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          <div className="p-6 space-y-8">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Basic Info</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferences</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Review</span>
              </div>
            </div>

            {/* Step 1: Basic Event Information */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">1</div>
                Basic Event Information
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => handleNewEventChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all dark:placeholder-gray-400"
                    placeholder="Enter an engaging event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => handleNewEventChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all dark:placeholder-gray-400"
                    placeholder="City, address, or landmark (e.g., Mumbai, Delhi, etc.)"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">We'll automatically determine coordinates for matching</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => handleNewEventChange('date', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all [color-scheme:dark]"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newEvent.duration}
                    onChange={(e) => handleNewEventChange('duration', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all dark:placeholder-gray-400"
                    placeholder="e.g., 4 hours, Half day, Full day"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Capacity *
                  </label>
                  <input
                    type="number"
                    value={newEvent.capacity}
                    onChange={(e) => handleNewEventChange('capacity', e.target.value)}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all dark:placeholder-gray-400"
                    placeholder="Max participants"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Category
                  </label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => handleNewEventChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="environmental">Environmental</option>
                    <option value="social">Social</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="community">Community</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Description *
                </label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => handleNewEventChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none dark:placeholder-gray-400"
                  placeholder="Describe your event, its goals, and what volunteers will do..."
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={newEvent.applicationDeadline}
                  onChange={(e) => handleNewEventChange('applicationDeadline', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all [color-scheme:dark]"
                  min={new Date().toISOString().split('T')[0]}
                  max={newEvent.date ? new Date(new Date(newEvent.date).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined}
                />
                {newEvent.date && newEvent.applicationDeadline && new Date(newEvent.applicationDeadline) >= new Date(newEvent.date) && (
                  <p className="text-red-500 text-sm mt-1">Application deadline must be before the event date</p>
                )}
              </div>
            </div>

            {/* Step 2: Matching Preferences */}
            <div className="bg-green-50 dark:bg-green-900/30 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">2</div>
                Smart Matching Preferences
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-6">These details help us match your event with the most suitable volunteers</p>

              <div className="space-y-6">
                {/* Waste Types */}
                <div>
                  <label className="flex items-center text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    <span>Waste Types Involved *</span>
                    <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 text-xs rounded-full">Required for matching</span>
                  </label>
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {[
                        { value: 'organic', label: 'Organic', emoji: '🥬' },
                        { value: 'plastic', label: 'Plastic', emoji: '🥤' },
                        { value: 'paper', label: 'Paper', emoji: '📄' },
                        { value: 'glass', label: 'Glass', emoji: '🍶' },
                        { value: 'metal', label: 'Metal', emoji: '🔧' },
                        { value: 'electronic', label: 'Electronic', emoji: '📱' },
                        { value: 'hazardous', label: 'Hazardous', emoji: '⚠️' },
                        { value: 'textile', label: 'Textile', emoji: '👕' },
                        { value: 'construction', label: 'Construction', emoji: '🧱' },
                        { value: 'medical', label: 'Medical', emoji: '💉' }
                      ].map((wasteType) => (
                        <label
                          key={wasteType.value}
                          className={`flex items-center space-x-2 cursor-pointer p-3 rounded-lg border-2 transition-all ${
                            newEvent.wasteTypes?.includes(wasteType.value)
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-200'
                              : 'border-gray-200 dark:border-gray-600 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={newEvent.wasteTypes?.includes(wasteType.value) || false}
                            onChange={() => handleWasteTypeToggle(wasteType.value)}
                            className="hidden"
                          />
                          <span className="text-lg">{wasteType.emoji}</span>
                          <span className="text-sm font-medium">{wasteType.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Experience Level and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Required Experience Level
                    </label>
                    <select
                      value={newEvent.requiredExperienceLevel}
                      onChange={(e) => handleNewEventChange('requiredExperienceLevel', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    >
                      <option value="beginner">🌱 Beginner - No prior experience needed</option>
                      <option value="intermediate">🌿 Intermediate - Some experience preferred</option>
                      <option value="advanced">🌳 Advanced - Experienced volunteers only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Preferred Time of Day
                    </label>
                    <select
                      value={newEvent.timeOfDay}
                      onChange={(e) => handleNewEventChange('timeOfDay', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    >
                      <option value="morning">🌅 Morning (6 AM - 12 PM)</option>
                      <option value="afternoon">☀️ Afternoon (12 PM - 6 PM)</option>
                      <option value="evening">🌆 Evening (6 PM - 10 PM)</option>
                      <option value="full-day">🌍 Full Day (All day event)</option>
                    </select>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Required Skills (Optional)
                  </label>
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-2 gap-2">
                      {availableSkills.map((skill) => (
                        <label
                          key={skill}
                          className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={newEvent.requiredSkills?.includes(skill) || false}
                            onChange={() => handleSkillToggle(skill)}
                            className="w-4 h-4 text-green-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-green-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Event Image */}
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">3</div>
                Event Banner Image
              </h4>

              {!newEvent.imagePreview ? (
                <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors bg-white dark:bg-gray-700">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Upload Event Image</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Add an engaging image to attract more volunteers</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl cursor-pointer transition-colors font-medium"
                    >
                      Choose Image
                    </label>
                    <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-700 border border-blue-200 dark:border-blue-700">
                  <img
                    src={newEvent.imagePreview}
                    alt="Event preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <button
                      onClick={removeImage}
                      className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tips Section */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">💡 Tips for a Successful Event</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Use clear, action-oriented titles</li>
                      <li>• Include specific location details</li>
                      <li>• Add an engaging banner image</li>
                      <li>• Specify required skills honestly</li>
                    </ul>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>• Select relevant waste types for better matching</li>
                      <li>• Set realistic capacity and duration</li>
                      <li>• Provide clear event descriptions</li>
                      <li>• Consider volunteer experience levels</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                📍 Events with waste types get better volunteer matches
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 transition-all font-medium shadow-lg flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Event...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Create Event</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CreateEventModal.displayName = 'CreateEventModal';

// Extracted EditEventModal component
const EditEventModal = memo(({
  showModal,
  setShowModal,
  editEvent,
  handleEditEventChange,
  handleUpdateEvent,
  loading
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Edit Event</h3>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                value={editEvent.title}
                onChange={(e) => handleEditEventChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:placeholder-gray-400"
                placeholder="Enter event title"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location *
              </label>
              <input
                type="text"
                value={editEvent.location}
                onChange={(e) => handleEditEventChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:placeholder-gray-400"
                placeholder="Event location"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date *
              </label>
              <input
                type="date"
                value={editEvent.date}
                onChange={(e) => handleEditEventChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent [color-scheme:dark]"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Capacity *
              </label>
              <input
                type="number"
                value={editEvent.capacity}
                onChange={(e) => handleEditEventChange('capacity', e.target.value)}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:placeholder-gray-400"
                placeholder="Maximum participants"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={editEvent.category}
                onChange={(e) => handleEditEventChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="environmental">Environmental</option>
                <option value="social">Social</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="community">Community</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={editEvent.duration}
                onChange={(e) => handleEditEventChange('duration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:placeholder-gray-400"
                placeholder="e.g., 4 hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={editEvent.applicationDeadline}
                onChange={(e) => handleEditEventChange('applicationDeadline', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent [color-scheme:dark]"
                min={new Date().toISOString().split('T')[0]}
                max={editEvent.date ? new Date(new Date(editEvent.date).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined}
              />
              {editEvent.date && editEvent.applicationDeadline && new Date(editEvent.applicationDeadline) >= new Date(editEvent.date) && (
                <p className="text-red-500 text-sm mt-1">Application deadline must be before the event date</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description *
            </label>
            <textarea
              value={editEvent.description}
              onChange={(e) => handleEditEventChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:placeholder-gray-400"
              placeholder="Describe the event"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Required Skills
            </label>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 max-h-32 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {['Environmental Conservation', 'Community Organizing', 'Event Management', 'Public Speaking', 'Social Media', 'Photography', 'First Aid', 'Teaching', 'Fundraising', 'Technical Skills'].map((skill) => (
                  <label
                    key={skill}
                    className="flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-white dark:hover:bg-gray-600 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={editEvent.requiredSkills?.includes(skill) || false}
                      onChange={() => {
                        const skills = editEvent.requiredSkills || [];
                        if (skills.includes(skill)) {
                          handleEditEventChange('requiredSkills', skills.filter(s => s !== skill));
                        } else {
                          handleEditEventChange('requiredSkills', [...skills, skill]);
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateEvent}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

EditEventModal.displayName = 'EditEventModal';

// Delete Confirmation Modal component
const DeleteConfirmationModal = memo(({
  showModal,
  setShowModal,
  eventToDelete,
  onConfirm,
  loading
}) => {
  if (!showModal || !eventToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/50 rounded-full">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
            Delete Event
          </h3>

          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
            Are you sure you want to delete <span className="font-semibold text-gray-800 dark:text-gray-200">"{eventToDelete.title}"</span>?
            This action cannot be undone and will remove all associated data.
          </p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowModal(false)}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : (
                'Delete Event'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

DeleteConfirmationModal.displayName = 'DeleteConfirmationModal';

// View Event Details Modal component
const ViewEventDetailsModal = memo(({
  showModal,
  setShowModal,
  event
}) => {
  if (!showModal || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-6 rounded-t-2xl z-10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{event.title}</h3>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                  event.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                  event.status === 'full' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {event.status}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-sm font-medium">
                  {event.category}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Event Image */}
          {event.imageUrl && (
            <div className="mb-6 rounded-xl overflow-hidden">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                  Location
                </h4>
                <p className="text-gray-700 dark:text-gray-300">{event.location}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                  Event Date
                </h4>
                <p className="text-gray-700 dark:text-gray-300">{new Date(event.date).toLocaleDateString()}</p>
              </div>

              {event.duration && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                    Duration
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">{event.duration}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                  Capacity
                </h4>
                <p className="text-gray-700 dark:text-gray-300">{event.registered || 0}/{event.capacity} registered</p>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${((event.registered || 0) / event.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                  <UserCheck className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                  Applications
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  {/* Add applications count logic here based on your applications data */}
                  Pending applications available
                </p>
              </div>

              {event.applicationDeadline && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                    Application Deadline
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">{new Date(event.applicationDeadline).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Description</h4>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{event.description}</p>
            </div>
          </div>

          {/* Required Skills */}
          {event.requiredSkills && event.requiredSkills.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {event.requiredSkills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowModal(false);
                // Add edit functionality
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ViewEventDetailsModal.displayName = 'ViewEventDetailsModal';

// Application Management Modal component
const ApplicationManagementModal = memo(({
  showModal,
  setShowModal,
  selectedEvent,
  applications,
  onApproveApplication,
  onRejectApplication,
  loading
}) => {
  if (!showModal || !selectedEvent) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Manage Applications</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{selectedEvent.title}</p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">No Applications Yet</h4>
              <p className="text-gray-500 dark:text-gray-400">Applications for this event will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{application.volunteerName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          application.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                          application.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                          'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                        }`}>
                          {application.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {application.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {application.phone}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Applied {new Date(application.appliedAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Award className="w-4 h-4 mr-2" />
                          {application.experience} experience
                        </div>
                      </div>

                      {application.skills && application.skills.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {application.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {application.message && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Message:</p>
                          <p className="text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-600 p-3 rounded border dark:border-gray-500">{application.message}</p>
                        </div>
                      )}
                    </div>

                    {application.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => onApproveApplication(application.id)}
                          disabled={loading}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectApplication(application.id)}
                          disabled={loading}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors text-sm flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ApplicationManagementModal.displayName = 'ApplicationManagementModal';

const NGODashboard = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showCreateEventModal, setShowCreateEventModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, events, volunteers, attendance, analytics
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [selectedEventForAttendance, setSelectedEventForAttendance] = useState(null)
  const [recentActivities, setRecentActivities] = useState([])
  const [activitiesLoading, setActivitiesLoading] = useState(false)
  // const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // // Theme Toggler
  // const toggleTheme = () => {
  //   const newTheme = theme === 'light' ? 'dark' : 'light';
  //   setTheme(newTheme);
  //   localStorage.setItem('theme', newTheme);
  // };

  // useEffect(() => {
  //   if (theme === 'dark') {
  //     document.documentElement.classList.add('dark');
  //   } else {
  //     document.documentElement.classList.remove('dark');
  //   }
  // }, [theme]);


  // Check if mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 // lg breakpoint
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // NGO Events State (limited to NGO-created events)
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Community Garden Project',
      description: 'Create sustainable community gardens in urban areas',
      location: 'Green Valley Community Center',
      date: '2025-09-20',
      capacity: 30,
      registered: 15,
      status: 'active',
      category: 'Environmental',
      createdBy: 'Green Earth NGO'
    },
    {
      id: 2,
      title: 'Recycling Awareness Workshop',
      description: 'Educational workshop on proper recycling practices',
      location: 'Community Library',
      date: '2025-09-25',
      capacity: 25,
      registered: 18,
      status: 'active',
      category: 'Education',
      createdBy: 'Green Earth NGO'
    },
    {
      id: 3,
      title: 'River Cleanup Drive',
      description: 'Clean the local river and restore its natural beauty',
      location: 'Riverside Park',
      date: '2025-09-30',
      capacity: 50,
      registered: 35,
      status: 'active',
      category: 'Environmental',
      createdBy: 'Green Earth NGO'
    }
  ])

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    capacity: '',
    category: 'environmental',
    image: null,
    imagePreview: null,
    duration: '',
    requiredSkills: [],
    applicationDeadline: '',
    wasteTypes: [],
    requiredExperienceLevel: 'beginner',
    timeOfDay: 'morning',
    coordinates: {
      latitude: null,
      longitude: null
    }
  })

  // Edit Event State
  const [showEditEventModal, setShowEditEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [editEvent, setEditEvent] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    capacity: '',
    category: 'environmental',
    image: null,
    imagePreview: null,
    duration: '',
    requiredSkills: [],
    applicationDeadline: ''
  })

  // Delete Event State
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)

  // View Event Details State
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false)
  const [selectedEventForDetails, setSelectedEventForDetails] = useState(null)

  // Application Management State
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedEventForApplications, setSelectedEventForApplications] = useState(null)

  // Mock applications data for fallback
  const mockApplications = [
    {
      id: 1,
      eventId: 1,
      volunteerName: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1 234-567-8901',
      status: 'pending',
      appliedAt: '2024-09-10',
      experience: 'Beginner',
      skills: ['Environmental Advocacy', 'Event Planning'],
      message: 'I am passionate about environmental conservation and would love to contribute to this community garden project.'
    },
    {
      id: 2,
      eventId: 1,
      volunteerName: 'Robert Chen',
      email: 'robert.chen@email.com',
      phone: '+1 234-567-8902',
      status: 'approved',
      appliedAt: '2024-09-08',
      experience: 'Intermediate',
      skills: ['Gardening', 'Community Organizing'],
      message: 'I have previous experience with community gardens and am excited to help.'
    },
    {
      id: 3,
      eventId: 2,
      volunteerName: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      phone: '+1 234-567-8903',
      status: 'pending',
      appliedAt: '2024-09-12',
      experience: 'Advanced',
      skills: ['Public Speaking', 'Education'],
      message: 'As an educator, I believe this workshop aligns perfectly with my passion for environmental education.'
    }
  ];

  const [applications, setApplications] = useState(mockApplications);

  // Handle input changes for new event
  const handleNewEventChange = useCallback((field, value) => {
    setNewEvent(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Handle input changes for edit event
  const handleEditEventChange = useCallback((field, value) => {
    setEditEvent(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Volunteer Management State (volunteers registered for NGO events)
  const [volunteers, setVolunteers] = useState([])
  const [volunteersLoading, setVolunteersLoading] = useState(false)

  // NGO Dashboard Stats
  const [stats, setStats] = useState([
    {
      title: 'Active Events',
      value: '0',
      change: '+0',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Volunteers',
      value: '0',
      change: '+0',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Total Impact Hours',
      value: '0',
      change: '+0',
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      title: 'Events Completed',
      value: '0',
      change: '+0',
      icon: Award,
      color: 'bg-orange-500'
    }
  ]);

  // Helper function to get icon component for activity type
  const getActivityIcon = (iconType) => {
    const iconProps = { className: "w-5 h-5 mr-3" };

    switch (iconType) {
      case 'user-check':
        return <UserCheck {...iconProps} className="w-5 h-5 mr-3 text-green-500" />;
      case 'calendar':
        return <Calendar {...iconProps} className="w-5 h-5 mr-3 text-blue-500" />;
      case 'calendar-plus':
        return <Plus {...iconProps} className="w-5 h-5 mr-3 text-purple-500" />;
      case 'check-circle':
        return <CheckCircle {...iconProps} className="w-5 h-5 mr-3 text-green-600" />;
      case 'heart':
        return <Heart {...iconProps} className="w-5 h-5 mr-3 text-red-500" />;
      case 'edit':
        return <Edit {...iconProps} className="w-5 h-5 mr-3 text-orange-500" />;
      default:
        return <Activity {...iconProps} className="w-5 h-5 mr-3 text-gray-500" />;
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMs = now - activityTime;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return '1 day ago';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return activityTime.toLocaleDateString();
    }
  };

  // Helper function to reload just recent activities
  const refreshRecentActivities = async () => {
    try {
      setActivitiesLoading(true);
      const activitiesResponse = await ngoAPI.getRecentActivities();
      const activitiesData = activitiesResponse.data || [];
      setRecentActivities(activitiesData);
    } catch (error) {
      console.error('Error refreshing activities:', error);
      toast.error('Failed to refresh activities');
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load volunteers on tab switch to 'volunteers'
  useEffect(() => {
    const loadVolunteers = async () => {
      try {
        setVolunteersLoading(true);
        const res = await ngoAPI.getMyVolunteers();
        const data = res?.data || [];
        setVolunteers(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        console.error('Error loading volunteers:', err);
        // Non-blocking toast to avoid noise if endpoint is unavailable
        // toast.error('Failed to load volunteers');
      } finally {
        setVolunteersLoading(false);
      }
    };

    if (activeTab === 'volunteers') {
      loadVolunteers();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Loading dashboard data...');

      const [statsResponse, eventsResponse, activitiesResponse, volunteersResponse] = await Promise.all([
        ngoAPI.getDashboardStats(),
        ngoAPI.getMyEvents(),
        ngoAPI.getRecentActivities(),
        ngoAPI.getMyVolunteers().catch(err => {
          console.warn('Failed to load volunteers list:', err?.response?.data || err.message);
          return { data: [] };
        })
      ]);

      console.log('Stats response:', statsResponse);
      console.log('Events response:', eventsResponse);
  console.log('Activities response:', activitiesResponse);
  console.log('Volunteers response:', volunteersResponse);

      // Extract data from API response
      const statsData = statsResponse.data || statsResponse;
      const eventsData = eventsResponse.data || eventsResponse;
  const activitiesData = activitiesResponse.data || [];
  const volunteersData = volunteersResponse?.data || [];

      console.log('Processed stats data:', statsData);
      console.log('Processed events data:', eventsData);
      console.log('Processed activities data:', activitiesData);

  // Set recent activities
      setRecentActivities(activitiesData);

  // Set volunteers fetched from backend (only those who applied/accepted for NGO events)
  setVolunteers(Array.isArray(volunteersData) ? volunteersData : (volunteersData.data || []));

      setStats([
        {
          title: 'Active Events',
          value: statsData.activeEvents || '0',
          change: '+2',
          icon: Calendar,
          color: 'bg-blue-500'
        },
        {
          title: 'Total Volunteers',
          value: statsData.totalVolunteers || '0',
          change: '+12',
          icon: Users,
          color: 'bg-green-500'
        },
        {
          title: 'Total Impact Hours',
          value: statsData.totalHours || statsData.totalImpactHours || '0',
          change: '+45',
          icon: Clock,
          color: 'bg-purple-500'
        },
        {
          title: 'Events Completed',
          value: statsData.completedEvents || statsData.eventsCompleted || '0',
          change: '+3',
          icon: Award,
          color: 'bg-orange-500'
        }
      ]);
      setEvents(eventsData);
      console.log('Dashboard data loaded successfully');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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

  // Create new event
  const handleCreateEvent = async () => {
    console.log('Create event called with:', newEvent); // Debug log

    if (!newEvent.title || !newEvent.description || !newEvent.location ||
      !newEvent.date || !newEvent.capacity) {
      console.log('Validation failed:', {
        title: newEvent.title,
        description: newEvent.description,
        location: newEvent.location,
        date: newEvent.date,
        capacity: newEvent.capacity
      }); // Debug log
      toast.error('Please fill in all required fields')
      return
    }

    // Validate waste types
    if (!newEvent.wasteTypes || newEvent.wasteTypes.length === 0) {
      toast.error('Please select at least one waste type')
      return
    }

    // Validate application deadline
    if (newEvent.applicationDeadline && newEvent.date) {
      if (new Date(newEvent.applicationDeadline) >= new Date(newEvent.date)) {
        toast.error('Application deadline must be before the event date')
        return
      }
    }

    try {
      setLoading(true)
      const eventData = {
        ...newEvent,
        capacity: parseInt(newEvent.capacity),
        // Send only the base64 image string, not the File object
        image: newEvent.imagePreview || null
      };

      // Remove the File object and imagePreview from the data being sent
      delete eventData.imagePreview;

      console.log('Sending event data:', {
        ...eventData,
        image: eventData.image ? `[Base64 string: ${eventData.image.substring(0, 50)}...]` : null
      }); // Debug log (truncated image for readability)
      const response = await ngoAPI.createEvent(eventData);
      console.log('Event creation response:', response); // Debug log

      setNewEvent({
        title: '',
        description: '',
        location: '',
        date: '',
        capacity: '',
        category: 'environmental',
        image: null,
        imagePreview: null,
        duration: '',
        requiredSkills: [],
        applicationDeadline: '',
        wasteTypes: [],
        requiredExperienceLevel: 'beginner',
        timeOfDay: 'morning',
        coordinates: {
          latitude: null,
          longitude: null
        }
      })
      setShowCreateEventModal(false)
      toast.success('Event created successfully!')
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEditEvent({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date,
      capacity: event.capacity.toString(),
      category: event.category || 'environmental',
      image: null,
      imagePreview: event.imageUrl || null,
      duration: event.duration || '',
      requiredSkills: event.requiredSkills || [],
      applicationDeadline: event.applicationDeadline || ''
    });
    setShowEditEventModal(true);
  };

  // Handle update event
  const handleUpdateEvent = async () => {
    if (!editEvent.title || !editEvent.description || !editEvent.location ||
      !editEvent.date || !editEvent.capacity) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate application deadline
    if (editEvent.applicationDeadline && editEvent.date) {
      if (new Date(editEvent.applicationDeadline) >= new Date(editEvent.date)) {
        toast.error('Application deadline must be before the event date')
        return
      }
    }

    try {
      setLoading(true)
      const eventData = {
        ...editEvent,
        capacity: parseInt(editEvent.capacity)
      };

      await ngoAPI.updateEvent(editingEvent._id || editingEvent.id, eventData);

      setShowEditEventModal(false);
      setEditingEvent(null);
      setEditEvent({
        title: '',
        description: '',
        location: '',
        date: '',
        capacity: '',
        category: 'environmental',
        image: null,
        imagePreview: null,
        duration: '',
        requiredSkills: [],
        applicationDeadline: ''
      });

      toast.success('Event updated successfully!');
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete event
  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  // Confirm delete event
  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      setLoading(true);
      await ngoAPI.deleteEvent(eventToDelete._id || eventToDelete.id);
      toast.success('Event deleted successfully!');
      setShowDeleteModal(false);
      setEventToDelete(null);
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  // Handle view applications
  const handleViewApplications = async (event) => {
    setSelectedEventForApplications(event);
    setShowApplicationModal(true);

    try {
      setLoading(true);
      console.log('Fetching applications for event:', event._id || event.id);
      const applicationsResponse = await ngoAPI.getEventRegistrations(event._id || event.id);
      console.log('Applications response:', applicationsResponse);
      setApplications(applicationsResponse.data || applicationsResponse || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
      // Fallback to dummy data for demo purposes if API fails
      setApplications(mockApplications.filter(app => app.eventId === (event._id || event.id)));
    } finally {
      setLoading(false);
    }
  };

  // Handle view event details
  const handleViewEventDetails = (event) => {
    setSelectedEventForDetails(event);
    setShowViewDetailsModal(true);
  };

  // Handle approve application
  const handleApproveApplication = async (applicationId) => {
    if (!selectedEventForApplications) return;

    try {
      setLoading(true);
      console.log('Approving application:', applicationId, 'for event:', selectedEventForApplications._id || selectedEventForApplications.id);
      await ngoAPI.reviewApplication(selectedEventForApplications._id || selectedEventForApplications.id, applicationId, { status: 'accepted' });

      // Update local state
      setApplications(prev => prev.map(app =>
        app._id === applicationId || app.id === applicationId ? { ...app, status: 'approved' } : app
      ));

      toast.success('Application approved successfully!');
      // Refresh data to sync with backend
      loadDashboardData();
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error(error.response?.data?.message || 'Failed to approve application');
    } finally {
      setLoading(false);
    }
  };

  // Handle reject application
  const handleRejectApplication = async (applicationId) => {
    if (!selectedEventForApplications) return;

    try {
      setLoading(true);
      console.log('Rejecting application:', applicationId, 'for event:', selectedEventForApplications._id || selectedEventForApplications.id);
      await ngoAPI.reviewApplication(selectedEventForApplications._id || selectedEventForApplications.id, applicationId, { status: 'rejected' });

      // Update local state
      setApplications(prev => prev.map(app =>
        app._id === applicationId || app.id === applicationId ? { ...app, status: 'rejected' } : app
      ));

      toast.success('Application rejected successfully!');
      // Refresh data to sync with backend
      loadDashboardData();
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error(error.response?.data?.message || 'Failed to reject application');
    } finally {
      setLoading(false);
    }
  };

  // Handle application review
  const handleReviewApplication = async (eventId, applicationId, status, reviewNote = '') => {
    try {
      await ngoAPI.reviewApplication(eventId, applicationId, { status, reviewNote });
      toast.success(`Application ${status} successfully!`);
      // Refresh data after review
      loadDashboardData();
    } catch (error) {
      console.error('Error reviewing application:', error);
      toast.error('Failed to review application');
    }
  };
  //   } catch (error) {
  //     toast.error('Failed to create event')
  //     console.error('Error creating event:', error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // Handle event status update
  const updateEventStatus = async (eventId, newStatus) => {
    try {
      setLoading(true)
      await ngoAPI.updateEvent(eventId, { status: newStatus })

      setEvents(events.map(event =>
        event.id === eventId ? { ...event, status: newStatus } : event
      ))
      toast.success(`Event ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`)
    } catch (error) {
      console.error('Error updating event status:', error)
      toast.error('Failed to update event status')
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    // In real app, load NGO data from API
    // loadNGODashboardData()
  }, [])

  const renderDashboardTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stat.value}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change} this month</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => setShowCreateEventModal(true)}
            className="flex items-center p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/50 dark:hover:bg-blue-900 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-blue-600 dark:text-blue-300 mr-3" />
            <span className="text-blue-800 dark:text-blue-200 font-medium">Create New Event</span>
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            className="flex items-center p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/50 dark:hover:bg-green-900 rounded-lg transition-colors"
          >
            <Users className="w-5 h-5 text-green-600 dark:text-green-300 mr-3" />
            <span className="text-green-800 dark:text-green-200 font-medium">Manage Volunteers</span>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className="flex items-center p-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/50 dark:hover:bg-purple-900 rounded-lg transition-colors"
          >
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-300 mr-3" />
            <span className="text-purple-800 dark:text-purple-200 font-medium">View All Events</span>
          </button>
          <button
            onClick={() => {
              const eventsWithApplications = events.filter(event =>
                applications.some(app => app.eventId === event.id && app.status === 'pending')
              );
              if (eventsWithApplications.length > 0) {
                handleViewApplications(eventsWithApplications[0]);
              } else {
                toast.info('No pending applications at the moment');
              }
            }}
            className="flex items-center p-4 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/50 dark:hover:bg-yellow-900 rounded-lg transition-colors"
          >
            <UserCheck className="w-5 h-5 text-yellow-600 dark:text-yellow-300 mr-3" />
            <span className="text-yellow-800 dark:text-yellow-200 font-medium">Review Applications</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h3>
          <button
            onClick={refreshRecentActivities}
            disabled={activitiesLoading}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh activities"
          >
            <RefreshCw className={`w-4 h-4 ${activitiesLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {activitiesLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading activities...</span>
          </div>
        ) : recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {getActivityIcon(activity.icon)}
                <div className="flex-1">
                  <p className="text-sm text-gray-800 dark:text-gray-200">{activity.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(activity.timestamp)}</p>
                  {activity.details && (
                    <div className="text-xs text-gray-400 mt-1">
                      {activity.details.category && (
                        <span className="inline-block bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full mr-2">
                          {activity.details.category}
                        </span>
                      )}
                      {activity.details.location && (
                        <span className="text-gray-500 dark:text-gray-400"> {activity.details.location}</span>
                      )}
                    </div>
                  )}
                </div>
                {activity.status && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    activity.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                    activity.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {activity.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activities</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Activities will appear here as they happen</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderEventsTab = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Events</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage and track your organization's events</p>
          </div>
          <button
            onClick={() => setShowCreateEventModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            <Plus className="w-5 h-5" />
            Create New Event
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No Events Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Start by creating your first event to engage volunteers</p>
          <button
            onClick={() => setShowCreateEventModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors mx-auto"
          >
            <Plus className="w-5 h-5" />
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                {/* Event Header */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{event.title}</h3>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          event.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                          event.status === 'inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                          event.status === 'full' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {event.status}
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-sm font-medium">
                          {event.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{event.description}</p>

                    {/* Event Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Location</span>
                        </div>
                        <p className="text-gray-900 dark:text-gray-200 font-medium text-sm">{event.location}</p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Date</span>
                        </div>
                        <p className="text-gray-900 dark:text-gray-200 font-medium text-sm">{new Date(event.date).toLocaleDateString()}</p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Capacity</span>
                        </div>
                        <p className="text-gray-900 dark:text-gray-200 font-medium text-sm">{event.registered}/{event.capacity} registered</p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                          <UserCheck className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Applications</span>
                        </div>
                        <p className="text-gray-900 dark:text-gray-200 font-medium text-sm">
                          {applications.filter(app => app.eventId === event.id && app.status === 'pending').length} pending
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 lg:flex-col lg:flex-shrink-0">
                    <button
                      onClick={() => handleViewEventDetails(event)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">View Details</span>
                    </button>

                    <button
                      onClick={() => handleEditEvent(event)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      title="Edit Event"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => handleViewApplications(event)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      title="Manage Applications"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Applications</span>
                    </button>

                    <button
                      onClick={() => updateEventStatus(event.id, event.status === 'active' ? 'inactive' : 'active')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                        event.status === 'active'
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                      title={event.status === 'active' ? 'Deactivate Event' : 'Activate Event'}
                    >
                      {event.status === 'active' ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      <span className="hidden sm:inline">
                        {event.status === 'active' ? 'Deactivate' : 'Activate'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDeleteEvent(event)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Registration Progress</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round((event.registered / event.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        (event.registered / event.capacity) * 100 >= 100 ? 'bg-red-500' :
                        (event.registered / event.capacity) * 100 >= 80 ? 'bg-orange-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderVolunteersTab = () => (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Registered Volunteers</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage volunteers registered for your events</p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            {volunteersLoading && (
              <span className="inline-flex items-center gap-2"><span className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span> Loading…</span>
            )}
            <span>Total: {volunteers.length} volunteers</span>
          </div>
        </div>
      </div>

      {/* Volunteers Grid */}
      {volunteers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{volunteersLoading ? 'Loading Volunteers…' : 'No Volunteers Yet'}</h3>
          <p className="text-gray-600 dark:text-gray-400">{volunteersLoading ? 'Fetching your volunteers from the server' : 'Volunteers will appear here when they register for your events'}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {volunteers.map((volunteer) => (
            <div
              key={volunteer.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-200 p-6"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div className="flex-1">
                  {/* Volunteer Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{volunteer.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                      volunteer.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {volunteer.status}
                    </span>
                  </div>

                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Email</span>
                      </div>
                      <p className="text-gray-900 dark:text-gray-200 font-medium text-sm break-all">{volunteer.email}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                        <Phone className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Phone</span>
                      </div>
                      <p className="text-gray-900 dark:text-gray-200 font-medium text-sm">{volunteer.phone}</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Hours</span>
                      </div>
                      <p className="text-gray-900 dark:text-gray-200 font-medium text-sm">{volunteer.totalHours} volunteer hours</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Joined</span>
                      </div>
                      <p className="text-gray-900 dark:text-gray-200 font-medium text-sm">{new Date(volunteer.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 text-sm rounded-full font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Registered Events Section */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Registered Events</h4>
                    <div className="flex flex-wrap gap-2">
                      {volunteer.registeredEvents.map((event, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-sm rounded-full font-medium">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 lg:flex-col lg:flex-shrink-0">
                  <button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    title="Contact Volunteer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">Contact</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  // Attendance Tab Render Function
  const renderAttendanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <UserCheck className="w-7 h-7 text-green-600" />
              Event Attendance Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage volunteer attendance for your events</p>
          </div>
        </div>

        {/* Event Selection Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.filter(event => event.status === 'active').map(event => (
            <div key={event.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-500 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{event.title}</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4 mr-2" />
                  {event.registered} registered volunteers
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedEventForAttendance(event.id);
                  setShowAttendanceModal(true);
                }}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                Manage Attendance
              </button>
            </div>
          ))}
        </div>

        {events.filter(event => event.status === 'active').length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Active Events</h3>
            <p className="text-gray-500 dark:text-gray-400">Create an event to start managing volunteer attendance</p>
            <button
              onClick={() => setShowCreateEventModal(true)}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Create Event
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="flex">
        <Side />

        <div className="flex-1">
          {/* Clean Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-sm">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      NGO Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Event & Volunteer Management</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {/* <button
                    onClick={toggleTheme}
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                  >
                    {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </button> */}
                  <button
                    onClick={() => window.location.reload()}
                    disabled={loading}
                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                  <button
                    onClick={() => setShowCreateEventModal(true)}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Event</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Navigation Tabs */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-1 py-4 overflow-x-auto">
                {[
                  { id: 'dashboard', label: 'Overview', icon: BarChart3, hideOnMobile: false },
                  { id: 'events', label: 'My Events', icon: Calendar, hideOnMobile: false },
                  { id: 'volunteers', label: 'Volunteers', icon: Users, hideOnMobile: false },
                  { id: 'attendance', label: 'Attendance', icon: UserCheck, hideOnMobile: false },
                  { id: 'analytics', label: 'Analytics', icon: TrendingUp, hideOnMobile: false }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 flex-shrink-0 focus:outline-none ${
                      activeTab === tab.id
                        ? 'text-green-700 bg-green-50 dark:text-green-200 dark:bg-green-900/50 border border-green-200 dark:border-green-700 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'dashboard' && renderDashboardTab()}
            {activeTab === 'events' && renderEventsTab()}
            {activeTab === 'volunteers' && renderVolunteersTab()}
            {activeTab === 'attendance' && renderAttendanceTab()}
            {activeTab === 'analytics' && <WasteZeroAnalytics userRole="ngo" />}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateEventModal
        showModal={showCreateEventModal}
        setShowModal={setShowCreateEventModal}
        newEvent={newEvent}
        handleNewEventChange={handleNewEventChange}
        handleCreateEvent={handleCreateEvent}
        loading={loading}
      />

      {/* View Event Details Modal */}
      <ViewEventDetailsModal
        showModal={showViewDetailsModal}
        setShowModal={setShowViewDetailsModal}
        event={selectedEventForDetails}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        eventToDelete={eventToDelete}
        onConfirm={confirmDeleteEvent}
        loading={loading}
      />

      {/* Application Management Modal */}
      <ApplicationManagementModal
        showModal={showApplicationModal}
        setShowModal={setShowApplicationModal}
        selectedEvent={selectedEventForApplications}
        applications={applications.filter(app => app.eventId === selectedEventForApplications?.id)}
        onApproveApplication={handleApproveApplication}
        onRejectApplication={handleRejectApplication}
        loading={loading}
      />

      <EditEventModal
        showModal={showEditEventModal}
        setShowModal={setShowEditEventModal}
        editEvent={editEvent}
        handleEditEventChange={handleEditEventChange}
        handleUpdateEvent={handleUpdateEvent}
        loading={loading}
      />

      {/* Attendance Management Modal */}
      {showAttendanceModal && selectedEventForAttendance && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <AttendanceManager
              eventId={selectedEventForAttendance}
              onClose={() => {
                setShowAttendanceModal(false);
                setSelectedEventForAttendance(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default NGODashboard