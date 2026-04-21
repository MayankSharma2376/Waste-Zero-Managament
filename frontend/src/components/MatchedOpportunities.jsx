// components/MatchedOpportunities.jsx
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Target,
  Loader
} from 'lucide-react';
import { volunteerAPI } from '../services/api';

export default function MatchedOpportunities({ onApply, loading: parentLoading }) {
  const [matchedOpportunities, setMatchedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    loadMatchedOpportunities();
  }, []);

  const loadMatchedOpportunities = async () => {
    try {
      setLoading(true);
      const response = await volunteerAPI.getMatchingOpportunities(6);
      setMatchedOpportunities(response.data || []);
    } catch (error) {
      console.error('Error loading matched opportunities:', error);
      // Don't show toast error as this is an optional feature
    } finally {
      setLoading(false);
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-400';
    if (score >= 60) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-400';
    return 'text-orange-600 bg-orange-100 dark:bg-orange-900/50 dark:text-orange-400';
  };

  const getWasteTypeIcon = (wasteType) => {
    const icons = {
      organic: '🍃',
      plastic: '♻️',
      paper: '📄',
      glass: '🥛',
      metal: '🔧',
      electronic: '💻',
      hazardous: '⚠️',
      textile: '👕',
      construction: '🏗️',
      medical: '🏥'
    };
    return icons[wasteType] || '♻️';
  };

  if (loading || parentLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 dark:border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
            Matched Opportunities
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-green-600 dark:text-green-400" />
        </div>
      </div>
    );
  }

  if (matchedOpportunities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 dark:border dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
            Matched Opportunities
          </h2>
        </div>
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Matches Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Update your preferences to get personalized opportunity recommendations.
          </p>
          <button
            onClick={() => window.location.hash = '#preferences'}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            Set Preferences
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 dark:border dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
          <Target className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
          Matched Opportunities
          <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 rounded-full">
            {matchedOpportunities.length} found
          </span>
        </h2>
        <button
          onClick={loadMatchedOpportunities}
          className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
        >
          Refresh Matches
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matchedOpportunities.map((match) => (
          <div 
            key={match.opportunity._id} 
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setExpandedCard(expandedCard === match.opportunity._id ? null : match.opportunity._id)}
          >
            {/* Match Score Badge */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
                  {match.opportunity.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {match.opportunity.description}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-bold ${getMatchScoreColor(match.score)}`}>
                {match.score}% match
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {match.opportunity.location}
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(match.opportunity.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {match.opportunity.registeredCount}/{match.opportunity.capacity} volunteers
              </div>
            </div>

            {/* Waste Types */}
            <div className="flex flex-wrap gap-1 mb-3">
              {match.opportunity.wasteTypes?.slice(0, 3).map((wasteType, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded"
                >
                  {getWasteTypeIcon(wasteType)} {wasteType}
                </span>
              ))}
              {match.opportunity.wasteTypes?.length > 3 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{match.opportunity.wasteTypes.length - 3} more
                </span>
              )}
            </div>

            {/* Expanded Details */}
            {expandedCard === match.opportunity._id && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Location Match:</span>
                    <div className="flex items-center mt-1">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${match.matchReasons.location}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">{match.matchReasons.location}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Waste Types:</span>
                    <div className="flex items-center mt-1">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${match.matchReasons.wasteTypes}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">{match.matchReasons.wasteTypes}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Skills:</span>
                    <div className="flex items-center mt-1">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${match.matchReasons.skills}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">{match.matchReasons.skills}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Experience:</span>
                    <div className="flex items-center mt-1">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${match.matchReasons.experience}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">{match.matchReasons.experience}%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply(match.opportunity._id);
                  }}
                  disabled={match.opportunity.status !== 'active' || match.opportunity.isFull}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {match.opportunity.isFull ? 'Full' : 'Apply Now'}
                </button>
              </div>
            )}

            {/* Quick Apply Button for collapsed state */}
            {expandedCard !== match.opportunity._id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(match.opportunity._id);
                }}
                disabled={match.opportunity.status !== 'active' || match.opportunity.isFull}
                className="w-full px-3 py-2 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {match.opportunity.isFull ? 'Full' : 'Quick Apply'}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => window.location.hash = '#opportunities'}
          className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
        >
          View All Opportunities →
        </button>
      </div>
    </div>
  );
}